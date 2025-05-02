import mqtt from 'mqtt'
// import mqtt from 'mqtt/build/index.js' //nodejs執行時真正入口, 為package.json內main, 但因路徑與自動補.js導致錯誤無法使用
// import mqtt from '../node_modules/mqtt/build/index.js' //nodejs執行時真正入口, 為package.json內main, 因新版import模組無法識別.js會再另外補.js, 以及相對路徑無法識別問題, 故須改用此格式import
import get from 'lodash-es/get.js'
import isestr from 'wsemi/src/isestr.mjs'
import ispint from 'wsemi/src/ispint.mjs'
import cint from 'wsemi/src/cint.mjs'
import j2o from 'wsemi/src/j2o.mjs'
import evem from 'wsemi/src/evem.mjs'
import genID from 'wsemi/src/genID.mjs'
import genPm from 'wsemi/src/genPm.mjs'
import waitFun from 'wsemi/src/waitFun.mjs'


/**
 * 建立一個 MQTT 客戶端，支援持久連線、Token 驗證、自動重連、訂閱與發佈功能。
 *
 * @param {Object} [opt={}] - 設定選項
 * @param {string} [opt.url='mqtt://localhost'] - MQTT broker 連線 URL
 * @param {number} [opt.port=8080] - Broker 連線 port
 * @param {string} [opt.token=''] - 連線時用來驗證的 Token
 * @param {string} [opt.clientId] - 指定 Client ID，若未指定則自動產生
 * @param {number} [opt.timeReconnect=2000] - 斷線後重新連線的間隔時間（毫秒）
 * @returns {Object} - 傳回一個具有 `subscribe`、`publish` 方法與事件的物件 (EventEmitter-like)
 * @example
 *
 * import w from 'wsemi'
 * import WPubsubClient from './src/WPubsubClient.mjs'
 * // import WPubsubClient from './dist/w-pubsub-client.umd.js'
 * // import WPubsubClient from './dist/w-pubsub-client.wk.umd.js'
 *
 * let test = async () => {
 *     let pm = w.genPm()
 *
 *     let ms = []
 *
 *     let clientId = 'id-for-client'
 *
 *     let opt = {
 *         port: 8080,
 *         token: 'token-for-test',
 *         clientId,
 *     }
 *     let wpc = new WPubsubClient(opt)
 *     // console.log('wpc', wpc)
 *
 *     let topic = 'task'
 *
 *     wpc.on('connect', () => {
 *         console.log('connect')
 *         ms.push({ clientId: `connect` })
 *     })
 *     wpc.on('reconnect', () => {
 *         console.log('reconnect')
 *     })
 *     wpc.on('offline', () => {
 *         console.log('offline')
 *     })
 *     // wpc.on(topic, (msg) => {
 *     //     console.log(`topic[${topic}]`, msg.toString())
 *     //     ms.push({ clientId: `receive topic[${topic}]` })
 *     // })
 *     wpc.on('message', ({ topic, message }) => {
 *         console.log(`message`, topic, message, message.toString())
 *         ms.push({ clientId: `receive topic[${topic}], message[${message.toString()}]` })
 *     })
 *     wpc.on('close', () => {
 *         console.log('close')
 *         ms.push({ clientId: `close` })
 *     })
 *     wpc.on('end', () => {
 *         console.log('end')
 *     })
 *     wpc.on('error', (err) => {
 *         console.log('error', err)
 *     })
 *
 *     await wpc.subscribe(topic, 2)
 *         .then((res) => {
 *             console.log('subscribe then', res)
 *             ms.push({ clientId: `subscribe`, subscriptions: JSON.stringify(res) })
 *         })
 *         .catch((err) => {
 *             console.log('subscribe catch', err)
 *         })
 *
 *     await wpc.publish(topic, 'result', 2)
 *         .then((res) => {
 *             console.log('publish then', res)
 *             ms.push({ clientId: `publish`, res })
 *         })
 *         .catch((err) => {
 *             console.log('publish catch', err)
 *         })
 *
 *     setTimeout(async() => {
 *         await wpc.clear()
 *         try { //使用worker版時要另外呼叫terminate中止
 *             wpc.terminate()
 *         }
 *         catch (err) {}
 *         console.log('ms', ms)
 *         pm.resolve(ms)
 *     }, 5000)
 *
 *     return pm
 * }
 * await test()
 *     .catch((err) => {
 *         console.log(err)
 *     })
 * // => ms [
 * //   { clientId: 'connect' },
 * //   {
 * //     clientId: 'subscribe',
 * //     subscriptions: '[{"topic":"task","qos":2}]'
 * //   },
 * //   { clientId: 'publish', res: 'done' },
 * //   { clientId: 'receive topic[task]' },
 * //   { clientId: 'close' }
 * // ]
 *
 */
function WPubsubClient(opt = {}) {

    //keyMsg
    let keyMsg = '__msg__'

    //url
    let url = get(opt, 'url')
    if (!isestr(url)) {
        url = 'mqtt://localhost'
    }

    //port
    let port = get(opt, 'port')
    if (!ispint(port)) {
        port = 8080
    }
    port = cint(port)

    //token
    let token = get(opt, 'token')
    if (!isestr(token)) {
        token = ''
    }

    //clientId
    let clientId = get(opt, 'clientId')
    if (!isestr(clientId)) {
        clientId = `cl-${genID()}`
    }

    //timeReconnect
    let timeReconnect = get(opt, 'timeReconnect')
    if (!ispint(timeReconnect)) {
        timeReconnect = 2000
    }
    timeReconnect = cint(timeReconnect)

    //urlBroker
    let urlBroker = `${url}:${port}`

    //client
    let client = mqtt.connect(urlBroker, {
        clientId,
        username: token, //提供token驗證
        password: '', //不提供
        clean: false, //設定持久Session(離線補收)
        reconnectPeriod: timeReconnect, //斷線後自動重連時間
    })

    //ev
    let ev = evem()

    //online
    let online = false

    //connect
    client.on('connect', () => {
        // console.log(`client in`, clientId)
        online = true
        ev.emit('connect')
    })

    //reconnect, 自動重連期間每次retry都會觸發一次
    client.on('reconnect', () => {
        // console.log(`client reconnect`, clientId)
        ev.emit('reconnect')
    })

    //subscribe
    let subscribe = async(topic, qos = 2) => {
        //qos:
        //0, 最多送一次
        //1, 至少送一次, 保證送到但可能重複送
        //2, 剛好送一次, 保證只送一次且不重複

        //pm
        let pm = genPm()

        //wait online
        await waitFun(() => {
            return online
        })

        //訂閱主題
        client.subscribe(topic, { qos }, (err, granted) => {
            // granted => [
            //   { topic: 'generate/report', qos: 2 },
            //   { topic: 'news/update', qos: 1 }
            // ]
            if (err) {
                pm.reject(err)
            }
            else {
                pm.resolve(granted)
            }
        })

        return pm
    }

    //unsubscribe
    let unsubscribe = async(topic) => {

        //pm
        let pm = genPm()

        //取消訂閱主題
        client.unsubscribe(topic, (err) => {
            if (err) {
                pm.reject(err)
            }
            else {
                pm.resolve()
            }
        })

        return pm
    }

    //publish
    let publish = async (topic, msg, qos = 2) => {
        //qos:
        //0, 最多送一次
        //1, 至少送一次, 保證送到但可能重複送
        //2, 剛好送一次, 保證只送一次且不重複

        //payload, 型別可支援: String, Buffer, Uint8Array, Number, Object(要JSON.stringify)
        let payload = JSON.stringify({ [keyMsg]: msg }) //封裝至msg可簡化使用型別, 僅支援Object, String, Number, Boolean
        // console.log('msg', msg)
        // console.log('payload', payload)

        //pm
        let pm = genPm()

        //發布主題
        client.publish(topic, payload, { qos }, (err) => {
            if (err) {
                pm.reject(err)
            }
            else {
                pm.resolve('done')
            }
        })

        return pm
    }

    //message
    client.on('message', (topic, message) => {
        // console.log(`client receive`, clientId, topic, message)
        let _message = ''
        try {
            let j = message.toString() //mqtt接收message時會變成Buffer, 得轉message.toString()
            // console.log('message j', j)
            let o = j2o(j)
            // console.log('message o', o)
            _message = get(o, keyMsg, '')
        }
        catch (err) {
            console.log(err)
        }
        ev.emit('message', { topic, message: _message })
    })

    // //simplifyError
    // let simplifyError = (err) => {
    //     if (err instanceof AggregateError && Array.isArray(err.errors)) {
    //         return err.errors.map(e => `[${e.address}:${e.port}] ${e.code}`).join(' | ')
    //     }
    //     if (err instanceof Error) {
    //         return err.message || String(err)
    //     }
    //     return String(err)
    // }

    //error
    client.on('error', (err) => {
        // console.log(`client error`, clientId, err.message)
        ev.emit('error', err)
        // ev.emit('error', simplifyError(err), err)
    })

    //offline, client判定已離線無法再與broker溝通時觸發
    client.on('offline', () => {
        // console.log(`client offline`, clientId)
        online = false
        ev.emit('offline')
    })

    //close
    client.on('close', () => {
        // console.log(`client close`, clientId)
        online = false
        ev.emit('close')
    })

    //end, 呼叫client.end()後觸發
    client.on('end', () => {
        // console.log(`client end`, clientId)
        online = false
        ev.emit('end')
    })

    //clear
    let clear = () => {
        return new Promise((resolve, reject) => {
            client.end(false, {}, (err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    //save
    ev.subscribe = subscribe
    ev.unsubscribe = unsubscribe
    ev.publish = publish
    ev.clear = clear

    return ev
}


export default WPubsubClient
