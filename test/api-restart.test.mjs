import assert from 'assert'
import {
    getTmpDir,
    cleanDir,
    waitEvent,
    waitServerSubscribed,
    startServer,
    startClientConnected
} from './tools/pubsubTestHelper.mjs'


//整合測試(本機起broker與client, 不連外): broker關閉後重啟, client自動重連並可再收發
//對應規則帳本R-RECONNECT-01, R-RECONNECT-02
describe('api-restart', function() {

    this.timeout(60000)

    let port = 8763 //各測試檔須使用不同port
    let dir = getTmpDir('api-restart')
    let token = 'token-for-restart'

    let srv = null
    let a = null //訂閱者
    let b = null //發布者

    before(async function() {
        cleanDir(dir)
        srv = await startServer({ port, storage: `${dir}/db1`, tokens: [token] })
        a = await startClientConnected({ port, token, clientId: 'rs-a', timeReconnect: 300 })
        b = await startClientConnected({ port, token, clientId: 'rs-b', timeReconnect: 300 })
        await a.wpc.subscribe('rs/t', 1)
    })

    after(async function() {
        await a.wpc.clear()
        await b.wpc.clear()
        await srv.wps.clear()
        cleanDir(dir)
    })

    //restartServer, 關閉現有broker並啟動新broker, 等到兩個client皆自動重連(connect事件)
    let restartServer = async(storage) => {

        //關閉前先備妥等待事件
        let pmCloseA = waitEvent(a.wpc, 'close')
        let pmCloseB = waitEvent(b.wpc, 'close')
        await srv.wps.clear()
        await pmCloseA
        await pmCloseB

        //重啟(同port), client以timeReconnect週期自動重連
        let pmConnA = waitEvent(a.wpc, 'connect')
        let pmConnB = waitEvent(b.wpc, 'connect')
        srv = await startServer({ port, storage, tokens: [token] })
        await pmConnA
        await pmConnB
    }

    it('R-RECONNECT-01: broker關閉後以同storage重啟, client自動重連(connect事件), 重連後可再發布與訂閱收訊', async function() {
        //重啟前: 往返一次
        await b.wpc.publish('rs/t', 'm1-before', 1)
        await a.inbox.waitCount(1)

        await restartServer(`${dir}/db1`)

        //重啟後: 沿用原client instance發布, 訂閱者(未重新呼叫subscribe)仍收到
        let res = await b.wpc.publish('rs/t', 'm2-after', 1)
        assert.strict.deepStrictEqual(res, 'done')
        let msgs = await a.inbox.waitMatch((m) => m.message === 'm2-after')

        //QoS1為至少一次: 重啟前m1之PUBACK若尚未被broker處理, 會於重連後以DUP重送(實測無等待時恆發生), 故不斷言總筆數,
        //只斷言: 首筆為m1, m2恰收到一次, 且除m1之重送外無其他訊息
        assert.strict.deepStrictEqual(msgs[0], { topic: 'rs/t', message: 'm1-before' })
        assert.strict.deepStrictEqual(msgs.filter((m) => m.message === 'm2-after').length, 1)
        assert.strict.deepStrictEqual(msgs.filter((m) => m.message !== 'm1-before' && m.message !== 'm2-after'), [])

        //重啟後之新訂閱亦可用
        let granted = await a.wpc.subscribe('rs/t2', 1)
        assert.strict.deepStrictEqual(granted, [{ topic: 'rs/t2', qos: 1 }])
        await b.wpc.publish('rs/t2', 'm3-new-topic', 1)
        msgs = await a.inbox.waitMatch((m) => m.message === 'm3-new-topic')
        assert.strict.deepStrictEqual(msgs[msgs.length - 1], { topic: 'rs/t2', message: 'm3-new-topic' })
    })

    it('R-RECONNECT-02: broker以全新storage重啟(舊session不存在), client自動重連後由client端自動重新訂閱, 訊息仍可收發', async function() {
        let n0 = a.inbox.msgs.length

        //以全新storage重啟; 新broker無任何訂閱關係(sessionPresent為false)
        await restartServer(`${dir}/db2`)

        //等到server端確認a已重新訂閱(由mqtt client於重連後自動重送subscribe), 之後發布才不會落在訂閱前
        await waitServerSubscribed(srv, 'rs-a', 'rs/t')

        await b.wpc.publish('rs/t', 'm4-new-storage', 1)
        let msgs = await a.inbox.waitMatch((m) => m.message === 'm4-new-storage')

        //新storage無舊session之未確認訊息, 故此後僅收到m4一筆
        assert.strict.deepStrictEqual(msgs.slice(n0), [{ topic: 'rs/t', message: 'm4-new-storage' }])
    })

})
