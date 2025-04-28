import mqtt from 'mqtt'
import get from 'lodash-es/get.js'
import isestr from 'wsemi/src/isestr.mjs'
import ispint from 'wsemi/src/ispint.mjs'
import isobj from 'wsemi/src/isobj.mjs'
import cint from 'wsemi/src/cint.mjs'
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
 *
 *     let topic = 'task'
 *
 *     wpc.on('connect', () => {
 *         console.log('connect')
 *         ms.push({ clientId: `connect` })
 *     })
 *     wpc.on(topic, (msg) => {
 *         console.log(`topic[${topic}]`, msg.toString())
 *         ms.push({ clientId: `receive topic[${topic}]` })
 *     })
 *     wpc.on('close', () => {
 *         console.log('close')
 *         ms.push({ clientId: `close` })
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
 * //   { clientId: 'close' },
 * //   { clientId: 'close' }
 * // ]
 *
 */
function WPubsubClient(opt = {}) {

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

    //publish
    let publish = async (topic, msg, qos = 2) => {
        //qos:
        //0, 最多送一次
        //1, 至少送一次, 保證送到但可能重複送
        //2, 剛好送一次, 保證只送一次且不重複

        //payload, 型別僅支援: String, Buffer, Uint8Array, Number, Object(要JSON.stringify)
        let payload = ''
        if (!isobj(msg)) {
            payload = JSON.stringify(msg)
        }
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
        // console.log(`client receive`, clientId, topic, message.toString())
        ev.emit(topic, message) //message若public是給字串, message會是buffer, 得要於接收端再處理message.toString()
    })

    //simplifyError
    let simplifyError = (err) => {
        if (err instanceof AggregateError && Array.isArray(err.errors)) {
            return err.errors.map(e => `[${e.address}:${e.port}] ${e.code}`).join(' | ')
        }
        if (err instanceof Error) {
            return err.message || String(err)
        }
        return String(err)
    }

    //error
    client.on('error', (err) => {
        // console.log(`client error`, clientId, err.message)
        ev.emit('error', simplifyError(err), err)
    })

    //close
    client.on('close', () => {
        // console.log(`client close`, clientId)
        online = false
        ev.emit('close')
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
    ev.publish = publish
    ev.clear = clear

    return ev
}


export default WPubsubClient
