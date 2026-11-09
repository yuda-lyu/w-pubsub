import assert from 'assert'
import {
    getTmpDir,
    cleanDir,
    waitEvent,
    startServer,
    startClient,
    startClientConnected
} from './tools/pubsubTestHelper.mjs'


//整合測試(本機起broker與client, 不連外): 發布與訂閱往返, 取消訂閱, token驗證
//對應規則帳本R-BROKER-01, R-BROKER-02, R-BROKER-03, R-AUTH-01
describe('api-roundtrip', function() {

    this.timeout(60000)

    let port = 8761 //各測試檔須使用不同port
    let dir = getTmpDir('api-roundtrip')
    let token = 'token-for-roundtrip'

    let srv = null
    let clients = []

    //newClient, 建立已連線之client並登記待清除
    let newClient = async(clientId) => {
        let c = await startClientConnected({ port, token, clientId, timeReconnect: 300 })
        clients.push(c)
        return c
    }

    before(async function() {
        cleanDir(dir)
        srv = await startServer({ port, storage: `${dir}/db`, tokens: [token] })
    })

    after(async function() {
        for (let c of clients) {
            await c.wpc.clear()
        }
        await srv.wps.clear()
        cleanDir(dir)
    })

    it('R-BROKER-01: QoS 0/1/2 之發布皆能被訂閱者收到, 且主題, 內容(字串/數字/物件)與server端publish事件一致', async function() {
        let sub = await newClient('rt-sub-1')
        let pub = await newClient('rt-pub-1')

        let cases = [
            { qos: 0, topic: 'rt/q0', msg: 'text-q0' },
            { qos: 1, topic: 'rt/q1', msg: 123.5 },
            { qos: 2, topic: 'rt/q2', msg: { a: 1, b: ['x', 'y'], c: { d: true } } },
        ]

        //訂閱: 回傳之granted須含主題與qos
        for (let cs of cases) {
            let granted = await sub.wpc.subscribe(cs.topic, cs.qos)
            assert.strict.deepStrictEqual(granted, [{ topic: cs.topic, qos: cs.qos }])
        }

        //發布: 逐筆發布並等到收到(同QoS下不依賴跨主題順序)
        let n = 0
        for (let cs of cases) {
            let res = await pub.wpc.publish(cs.topic, cs.msg, cs.qos)
            assert.strict.deepStrictEqual(res, 'done')
            n++
            await sub.inbox.waitCount(n)
        }

        assert.strict.deepStrictEqual(sub.inbox.msgs, cases.map((cs) => {
            return { topic: cs.topic, message: cs.msg }
        }))

        //server端: publish事件須帶發布者clientId, 主題, 解封裝後之內容與qos
        let evsPub = srv.events.filter((e) => {
            return e.type === 'publish' && e.clientId === 'rt-pub-1'
        })
        assert.strict.deepStrictEqual(evsPub.map((e) => {
            return { topic: e.topic, payload: e.payload, qos: e.qos }
        }), cases.map((cs) => {
            return { topic: cs.topic, payload: cs.msg, qos: cs.qos }
        }))

        //server端: subscribe事件須帶訂閱者clientId與訂閱內容
        let evsSub = srv.events.filter((e) => {
            return e.type === 'subscribe' && e.clientId === 'rt-sub-1'
        })
        assert.strict.deepStrictEqual(evsSub.map((e) => {
            return e.subscriptions
        }), cases.map((cs) => {
            return [{ topic: cs.topic, qos: cs.qos }]
        }))

        //server端: client-in須含兩個client
        let ins = srv.events.filter((e) => {
            return e.type === 'client-in' && (e.clientId === 'rt-sub-1' || e.clientId === 'rt-pub-1')
        }).map((e) => {
            return e.clientId
        }).sort()
        assert.strict.deepStrictEqual(ins, ['rt-pub-1', 'rt-sub-1'])
    })

    it('R-BROKER-02: 未訂閱之主題不送達(含已訂閱主題之子層級主題), 僅完全相符之主題送達', async function() {
        let sub = await newClient('rt-sub-2')
        let pub = await newClient('rt-pub-2')

        await sub.wpc.subscribe('rt/yes', 1)

        //先發布未訂閱之主題, 再發布已訂閱之主題; 同一broker依序處理, 若未訂閱者被送達則會先於rt/yes出現
        await pub.wpc.publish('rt/no', 'not-subscribed', 1)
        await pub.wpc.publish('rt/yes/sub', 'not-exactly-same', 1)
        await pub.wpc.publish('rt/yes', 'subscribed', 1)

        await sub.inbox.waitCount(1)
        assert.strict.deepStrictEqual(sub.inbox.msgs, [{ topic: 'rt/yes', message: 'subscribed' }])
    })

    it('R-BROKER-03: unsubscribe後不再收到該主題之訊息', async function() {
        let sub = await newClient('rt-sub-3')
        let pub = await newClient('rt-pub-3')

        await sub.wpc.subscribe('rt/un', 1)
        await sub.wpc.subscribe('rt/sentinel', 1)

        //取消前可收到
        await pub.wpc.publish('rt/un', 'before', 1)
        await sub.inbox.waitCount(1)

        //取消後發布rt/un, 再發布哨兵主題; 哨兵到達時若rt/un之訊息會被送達, 必已先於哨兵出現
        await sub.wpc.unsubscribe('rt/un')
        await pub.wpc.publish('rt/un', 'after', 1)
        await pub.wpc.publish('rt/sentinel', 'sentinel', 1)
        await sub.inbox.waitCount(2)

        assert.strict.deepStrictEqual(sub.inbox.msgs, [
            { topic: 'rt/un', message: 'before' },
            { topic: 'rt/sentinel', message: 'sentinel' },
        ])
    })

    it('R-AUTH-01: token錯誤或未提供之client被拒絕(error事件為連線被拒, 隨後close), 不會connect, 且server端無client-in', async function() {
        let cases = [
            { name: 'wrong', token: 'token-not-allowed', clientId: 'rt-bad-1' },
            { name: 'empty', token: '', clientId: 'rt-bad-2' },
        ]
        for (let cs of cases) {
            let c = startClient({ port, token: cs.token, clientId: cs.clientId, timeReconnect: 300 })
            clients.push(c)

            let connected = false
            c.wpc.on('connect', () => {
                connected = true
            })

            //被拒時先emit error再close
            let [err] = await waitEvent(c.wpc, 'error')
            assert.ok(/Bad username or password/.test(err.message), `[${cs.name}] ${err.message}`)
            await waitEvent(c.wpc, 'close')
            assert.strict.deepStrictEqual(connected, false)
        }

        //server端未曾收到被拒client之client-in
        let ins = srv.events.filter((e) => {
            return e.type === 'client-in' && (e.clientId === 'rt-bad-1' || e.clientId === 'rt-bad-2')
        })
        assert.strict.deepStrictEqual(ins, [])

        //被拒不影響合法client
        let ok = await newClient('rt-ok-4')
        let granted = await ok.wpc.subscribe('rt/ok', 1)
        assert.strict.deepStrictEqual(granted, [{ topic: 'rt/ok', qos: 1 }])
    })

})
