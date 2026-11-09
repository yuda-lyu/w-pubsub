import assert from 'assert'
import WPubsubClientComu from '../src/WPubsubClientComu.mjs'
import {
    getTmpDir,
    cleanDir,
    waitEvent,
    waitServerSubscribed,
    startServer,
    startClientConnected
} from './tools/pubsubTestHelper.mjs'


//整合測試(本機起broker與client, 不連外): 以Object.prototype既有之名稱(__proto__, constructor等)作為clientId或topic,
//broker須如一般名稱處理而不崩潰(aedes 1.1.3修補之broker.clients/client.subscriptions改為null-prototype)
//對應規則帳本R-BROKER-04
describe('api-proto-key', function() {

    this.timeout(60000)

    let port = 8764 //各測試檔須使用不同port
    let dir = getTmpDir('api-proto-key')
    let token = 'token-for-proto-key'

    //Object.prototype上既有之名稱, 以及會被當成物件鍵取值之名稱
    let keys = ['__proto__', 'constructor', 'toString', 'hasOwnProperty', 'valueOf', 'prototype']

    let srv = null
    let clients = []
    let uncaught = []
    let onUncaught = (err) => {
        uncaught.push(err)
    }

    //newClient, 建立已連線之client並登記待清除
    let newClient = async(clientId) => {
        let c = await startClientConnected({ port, token, clientId, timeReconnect: 300 })
        clients.push(c)
        return c
    }

    before(async function() {
        cleanDir(dir)

        //broker若崩潰(未捕捉例外)會落於此, 於測試結尾斷言為空
        process.on('uncaughtException', onUncaught)

        srv = await startServer({ port, storage: `${dir}/db`, tokens: [token] })
    })

    after(async function() {
        process.off('uncaughtException', onUncaught)
        for (let c of clients) {
            await c.wpc.clear()
        }
        await srv.wps.clear()
        cleanDir(dir)
    })

    it('R-BROKER-04a: 以Object.prototype既有名稱作為clientId, 可正常連線, 訂閱, 發布與收訊, broker不崩潰', async function() {
        let pub = await newClient('pk-pub-a')

        for (let key of keys) {
            //clientId為key之client
            let sub = await newClient(key)
            assert.ok(srv.events.some((e) => e.type === 'client-in' && e.clientId === key), `client-in[${key}]`)

            let topic = `pk/a/${key}`
            await sub.wpc.subscribe(topic, 1)
            await pub.wpc.publish(topic, `msg-for-${key}`, 1)
            let msgs = await sub.inbox.waitCount(1)
            assert.strict.deepStrictEqual(msgs, [{ topic, message: `msg-for-${key}` }])
        }

        assert.strict.deepStrictEqual(uncaught.map((err) => err.message), [])
    })

    it('R-BROKER-04b: 以Object.prototype既有名稱作為完整topic, 可正常訂閱, 發布與收訊, broker不崩潰', async function() {
        let sub = await newClient('pk-sub-b')
        let pub = await newClient('pk-pub-b')

        for (let key of keys) {
            let n = sub.inbox.msgs.length

            //topic完整為key(非前綴)
            let granted = await sub.wpc.subscribe(key, 1)
            assert.strict.deepStrictEqual(granted, [{ topic: key, qos: 1 }])
            await pub.wpc.publish(key, `msg-for-topic-${key}`, 1)
            let msgs = await sub.inbox.waitCount(n + 1)
            assert.strict.deepStrictEqual(msgs[n], { topic: key, message: `msg-for-topic-${key}` })

            //取消訂閱(unsubscribe路徑亦以該名稱為鍵)須成功
            await sub.wpc.unsubscribe(key)
        }

        assert.strict.deepStrictEqual(uncaught.map((err) => err.message), [])
    })

    it('R-BROKER-04c: 同一個Object.prototype既有名稱之clientId重複連線(取代舊連線)時, broker不崩潰, 舊連線被關閉, 新連線可用', async function() {
        for (let key of ['__proto__', 'constructor']) {
            let first = await newClient(key)

            //相同clientId再連線, broker依MQTT規範關閉舊連線
            let pmClose = waitEvent(first.wpc, 'close')
            let second = await newClient(key)
            await pmClose

            //新連線可正常收發
            let pub = await newClient(`pk-pub-c-${key}`)
            let topic = `pk/c/${key}`
            await second.wpc.subscribe(topic, 1)
            await pub.wpc.publish(topic, `msg-for-${key}`, 1)
            let msgs = await second.inbox.waitCount(1)
            assert.strict.deepStrictEqual(msgs, [{ topic, message: `msg-for-${key}` }])
        }

        assert.strict.deepStrictEqual(uncaught.map((err) => err.message), [])
    })

    it('R-CLIENT-01: WPubsubClientComu收到以Object.prototype既有名稱作為id之訊息時不誤判, 不崩潰, 不污染原型, 仍可正常服務與調用', async function() {
        //服務端: 提供svc-pk之calc
        let svc = new WPubsubClientComu('svc-pk', ['calc'], { port, token, clientId: 'pk-svc', timeReconnect: 300 })
        clients.push({ wpc: svc })
        svc.on('procFun', ({ func, input, pm }) => {
            pm.resolve(`${input.p1}+${input.p2}=${input.p1 + input.p2}`)
        })
        await waitEvent(svc, 'connect')
        await waitServerSubscribed(srv, 'pk-svc', 'svc-pk:calc')

        //原始client: 直接對服務主題發布id為key之訊息(wire上之id由對方決定), 並訂閱同主題觀察服務端回應
        let raw = await newClient('pk-raw')
        await raw.wpc.subscribe('svc-pk:calc', 1)
        for (let key of keys) {
            //output訊息: 無對應之等待者, 不得誤判為有等待者
            await raw.wpc.publish('svc-pk:calc', { func: 'calc', id: key, mode: 'output', output: { state: 'success', msg: 'x' } }, 1)
            //input訊息: 服務端須照常處理並以相同id回應output
            await raw.wpc.publish('svc-pk:calc', { func: 'calc', id: key, mode: 'input', input: { p1: 1, p2: 2 } }, 1)
        }

        //raw收到: 自己發布之output與input各1筆(同主題之回送), 加服務端回應之output 1筆, 每個key共3筆
        let msgs = await raw.inbox.waitCount(keys.length * 3)
        let outs = msgs.filter((m) => {
            return m.message.mode === 'output' && m.message.output.msg === '1+2=3'
        })
        assert.strict.deepStrictEqual(outs.map((m) => m.message.id).sort(), keys.slice().sort())

        //調用端(僅調用不提供服務, funcs為空陣列): 一般reqServiceFunc仍可正常取得結果
        //註: funcs為空時WPubsubClientComu建構會印出'subscribe topic[] catch Error: Invalid topic empty_topic_list'(mqtt 5.13.3與5.16.1皆同, 見sgud/state/state.md已知缺口), 非本測試之失敗
        let req = new WPubsubClientComu('svc-req', [], { port, token, clientId: 'pk-req', timeReconnect: 300 })
        clients.push({ wpc: req })
        let r = await req.reqServiceFunc('svc-pk', 'calc', { p1: 2, p2: 3 })
        assert.strict.deepStrictEqual(r, '2+3=5')

        //未污染Object.prototype, 且未發生未捕捉例外
        assert.strict.deepStrictEqual(({}).output, undefined)
        assert.strict.deepStrictEqual(({}).state, undefined)
        assert.strict.deepStrictEqual(uncaught.map((err) => err.message), [])
    })

    it('R-BROKER-04d: 上述情境後broker仍正常服務一般clientId與topic, 且未發出broker-error', async function() {
        let sub = await newClient('pk-sub-d')
        let pub = await newClient('pk-pub-d')
        await sub.wpc.subscribe('pk/d', 2)
        await pub.wpc.publish('pk/d', 'still-alive', 2)
        let msgs = await sub.inbox.waitCount(1)
        assert.strict.deepStrictEqual(msgs, [{ topic: 'pk/d', message: 'still-alive' }])

        assert.strict.deepStrictEqual(srv.errors.map((e) => `${e.type}:${e.err && e.err.message}`), [])
        assert.strict.deepStrictEqual(uncaught.map((err) => err.message), [])
    })

})
