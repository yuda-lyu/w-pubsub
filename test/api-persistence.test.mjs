import assert from 'assert'
import fs from 'fs'
import {
    getTmpDir,
    cleanDir,
    waitEvent,
    startServer,
    startClient,
    startClientConnected
} from './tools/pubsubTestHelper.mjs'


//整合測試(本機起broker與client, 不連外): 持久化(client使用clean:false持久session, broker使用LevelDB持久化)
//語意: client離線期間發布之QoS1/2訊息, 於同clientId重連後補收; QoS0不補收; 補收不需重新subscribe; broker重啟後仍補收
//對應規則帳本R-PERSIST-01, R-PERSIST-02
describe('api-persistence', function() {

    this.timeout(60000)

    let port = 8762 //各測試檔須使用不同port
    let dir = getTmpDir('api-persistence')
    let storage = `${dir}/db`

    let srv = null
    let clients = []

    //newClient, 建立已連線之client並登記待清除
    let newClient = async(clientId) => {
        let c = await startClientConnected({ port, clientId, timeReconnect: 300 })
        clients.push(c)
        return c
    }

    //closeClient, 結束client並等到server端確認其離線(此後發布之訊息才確實屬離線期間)
    let closeClient = async(c, clientId) => {
        let pmOut = waitEvent(srv.wps, 'client-out', { pred: (id) => id === clientId })
        await c.wpc.clear()
        await pmOut
    }

    before(function() {
        cleanDir(dir)
    })

    after(async function() {
        for (let c of clients) {
            await c.wpc.clear()
        }
        await srv.wps.clear()
        cleanDir(dir)
    })

    it('R-PERSIST-01: client離線期間發布之QoS1/2訊息, 同clientId重連後依序補收且不需重新subscribe, QoS0不補收', async function() {
        srv = await startServer({ port, storage })

        //訂閱者先訂閱後離線
        let sub1 = await newClient('ps-sub-1')
        await sub1.wpc.subscribe('ps/off', 1)
        await closeClient(sub1, 'ps-sub-1')

        //離線期間發布: QoS0, QoS1, QoS2(訂閱qos為1, 故QoS2訊息以QoS1補送)
        let pub = await newClient('ps-pub-1')
        await pub.wpc.publish('ps/off', 'm0-qos0', 0)
        await pub.wpc.publish('ps/off', 'm1-qos1', 1)
        await pub.wpc.publish('ps/off', { k: 'm2-qos2' }, 2)

        //同clientId重連(新instance, 不呼叫subscribe), 補收離線期間之QoS1/2訊息
        let sub2 = await newClient('ps-sub-1')
        let msgs = await sub2.inbox.waitCount(2)
        assert.strict.deepStrictEqual(msgs, [
            { topic: 'ps/off', message: 'm1-qos1' },
            { topic: 'ps/off', message: { k: 'm2-qos2' } },
        ])

        //重連後之即時訊息仍可收到, 且此前之QoS0訊息未被補送(收到之第3筆即為此即時訊息)
        await pub.wpc.publish('ps/off', 'm3-live', 1)
        msgs = await sub2.inbox.waitCount(3)
        assert.strict.deepStrictEqual(msgs[2], { topic: 'ps/off', message: 'm3-live' })
        assert.strict.deepStrictEqual(msgs.length, 3)
    })

    it('R-PERSIST-02: 持久化資料寫入storage, broker關閉並以同storage重啟後, client離線期間發布之QoS1訊息仍可補收(訂閱關係亦保留)', async function() {
        //訂閱者先訂閱後離線
        let sub1 = await newClient('ps-sub-2')
        await sub1.wpc.subscribe('ps/restart', 1)
        await closeClient(sub1, 'ps-sub-2')

        //離線期間發布(發布者隨後亦離線, 避免broker關閉時引發其重連)
        let pub = await newClient('ps-pub-2')
        await pub.wpc.publish('ps/restart', 'before-restart-1', 1)
        await pub.wpc.publish('ps/restart', 'before-restart-2', 1)
        await closeClient(pub, 'ps-pub-2')

        //關閉broker: 資料須已寫入storage, 且資料庫鎖已釋放才能由同storage重啟
        await srv.wps.clear()
        assert.ok(fs.existsSync(storage), `storage[${storage}] should exist`)
        assert.ok(fs.readdirSync(storage).length > 0, `storage[${storage}] should not be empty`)

        //同port同storage重啟
        srv = await startServer({ port, storage })

        //同clientId重連, 不呼叫subscribe, 補收重啟前發布之訊息
        let sub2 = await newClient('ps-sub-2')
        let msgs = await sub2.inbox.waitCount(2)
        assert.strict.deepStrictEqual(msgs, [
            { topic: 'ps/restart', message: 'before-restart-1' },
            { topic: 'ps/restart', message: 'before-restart-2' },
        ])

        //重啟後之訂閱關係仍在: 新發布之訊息可即時收到
        let pub2 = await newClient('ps-pub-3')
        await pub2.wpc.publish('ps/restart', 'after-restart', 1)
        msgs = await sub2.inbox.waitCount(3)
        assert.strict.deepStrictEqual(msgs[2], { topic: 'ps/restart', message: 'after-restart' })
    })

    it('R-PERSIST-03: storage已被另一個server占用(資料庫無法開啟)時, 後啟動者以broker-error通知而不使行程崩潰, 先啟動者不受影響, 後啟動者之clear()可正常結束', async function() {
        let portB = 8765

        //同storage再起一個server(占用中)
        let srvB = await startServer({ port: portB, storage })

        //須收到broker-error: 先查已紀錄者, 無才等待(查與掛監聽之間無await, 不會漏)
        if (!srvB.errors.some((e) => e.type === 'broker-error')) {
            await waitEvent(srvB.wps, 'broker-error')
        }

        //後啟動者之broker不可用: 連線被關閉而不是被接受(不會connect, 但會close)
        let cB = startClient({ port: portB, clientId: 'ps-b-1', timeReconnect: 300 })
        clients.push(cB)
        let connected = false
        cB.wpc.on('connect', () => {
            connected = true
        })
        await waitEvent(cB.wpc, 'close')
        assert.strict.deepStrictEqual(connected, false)

        //先啟動者不受影響: 仍可收發
        let sub = await newClient('ps-sub-4')
        let pub = await newClient('ps-pub-4')
        await sub.wpc.subscribe('ps/lock', 1)
        await pub.wpc.publish('ps/lock', 'still-ok', 1)
        let msgs = await sub.inbox.waitCount(1)
        assert.strict.deepStrictEqual(msgs, [{ topic: 'ps/lock', message: 'still-ok' }])

        //後啟動者之clear()不丟錯, 且釋放其監聽埠
        await srvB.wps.clear()
    })

})
