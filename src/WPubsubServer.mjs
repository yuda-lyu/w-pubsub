import Aedes from 'aedes'
import aedesPersistenceLevel from 'aedes-persistence-level'
import net from 'net'
import { Level } from 'level'
import get from 'lodash-es/get.js'
import size from 'lodash-es/size.js'
import isestr from 'wsemi/src/isestr.mjs'
import iseobj from 'wsemi/src/iseobj.mjs'
import ispint from 'wsemi/src/ispint.mjs'
import isearr from 'wsemi/src/isearr.mjs'
import cstr from 'wsemi/src/cstr.mjs'
import cint from 'wsemi/src/cint.mjs'
import evem from 'wsemi/src/evem.mjs'


/**
 * 建立一個支援 Token 驗證與 LevelDB 持久化儲存的 MQTT Server (基於 Aedes)。
 *
 * @param {Object} [opt={}] - 設定參數物件
 * @param {Number} [opt.port=8080] - 要監聽的 TCP 連接埠 (預設 8080)
 * @param {String} [opt.storage='./_db'] - 持久化資料儲存目錄 (LevelDB 路徑)
 * @param {Array} [opt.tokens=[]] - 可接受的連線 token 列表，若為空則允許所有連線
 * @returns {Object} - Aedes broker 實例物件
 * @example
 *
 * import w from 'wsemi'
 * import WPubsubServer from './src/WPubsubServer.mjs'
 *
 * let test = () => {
 *     let pm = w.genPm()
 *
 *     let ms = []
 *
 *     let opt = {
 *         port: 8080,
 *         storage: './_db',
 *         tokens: ['token-for-test'],
 *     }
 *     let wps = new WPubsubServer(opt)
 *     wps.on('server-listen', (msg) => {
 *         console.log('server-listen', msg)
 *         ms.push({ 'server-listen': msg })
 *     })
 *     wps.on('client-in', (clientId) => {
 *         console.log('client-in', clientId)
 *         ms.push({ 'client-in': clientId })
 *     })
 *     wps.on('client-out', (clientId) => {
 *         console.log('client-out', clientId)
 *         ms.push({ 'client-out': clientId })
 *     })
 *     wps.on('subscribe', (clientId, subscriptions) => {
 *         console.log('subscribe', clientId, subscriptions)
 *         ms.push({ 'subscribe': clientId, 'subscriptions': JSON.stringify(subscriptions) })
 *     })
 *     wps.on('publish', (clientId, topic, payload, qos) => {
 *         console.log('publish', clientId, topic, payload.toString(), qos)
 *         ms.push({ 'publish': clientId, topic, 'payload': payload.toString(), qos })
 *     })
 *     wps.on('server-error', (err) => {
 *         console.log('server-error', err)
 *     })
 *     wps.on('broker-error', (err) => {
 *         console.log('broker-error', err)
 *     })
 *     wps.on('client-error', (clientId, err) => {
 *         console.log('client-error', clientId, err)
 *     })
 *
 *     setTimeout(async () => {
 *         await wps.clear()
 *         console.log('ms', ms)
 *         pm.resolve(ms)
 *     }, 15000)
 *
 *     return pm
 * }
 * await test()
 *     .catch((err) => {
 *         console.log(err)
 *     })
 * // => ms [
 * //   { 'server-listen': { port: 8080 } },
 * //   { 'client-in': 'id-for-client' },
 * //   {
 * //     subscribe: 'id-for-client',
 * //     subscriptions: '[{"topic":"task","qos":2}]'
 * //   },
 * //   { publish: 'id-for-client', topic: 'task', payload: '"result"', qos: 2 },
 * //   { 'client-out': 'id-for-client' }
 * // ]
 *
 */
function WPubsubServer(opt = {}) {

    //port
    let port = get(opt, 'port')
    if (!ispint(port)) {
        port = 8080
    }
    port = cint(port)

    //storage
    let storage = get(opt, 'storage')
    if (!isestr(storage)) {
        storage = './_db' //LevelDB路徑
    }

    //tokens
    let tokens = get(opt, 'tokens')
    if (!isearr(tokens)) {
        tokens = []
    }
    let stTokens = new Set(tokens) //可用的合法 Token 列表

    //db
    let db = new Level(storage)

    //persistenceInstance
    let persistenceInstance = aedesPersistenceLevel(db)

    //broker
    let broker = Aedes({
        persistence: persistenceInstance,
        authenticate: (client, username, password, callback) => {
            // console.log('authenticate', client.id, username, password)
            // console.log('client.id', client.id)
            // console.log('username', username)
            // console.log('password', password)

            //check
            if (size(tokens) === 0) {
                return callback(null, true)
            }

            //check
            if (!isestr(username)) {
                let err = new Error('missing token')
                err.returnCode = 4 // MQTT 3.1.1: "Connection Refused: bad username or password"
                return callback(err, false)
            }

            //token
            let token = cstr(username)

            //check
            if (stTokens.has(token)) {
                // console.log('client conn', `token[${token}]`, `client.id[${client.id}]`)
                return callback(null, true)
            }

            //err
            let err = new Error('invalid token')
            err.returnCode = 4
            // console.log('client deny', `token[${token}]`, `client.id[${client.id}]`)
            return callback(err, false)
        }
    })

    //server
    let server = net.createServer(broker.handle)

    //listen
    server.listen(port, () => {
        // console.log(`Server started and listening on port ${port}`)
        ev.emit('server-listen', { port })
    })

    //error
    server.on('error', (err) => {
        // console.error('Server error:', err)
        ev.emit('server-error', err) // 也可以轉發出去
    })

    //ev
    let ev = evem()

    //客戶端連線
    broker.on('client', (client) => {
        // console.log('client in', `client.id[${client.id}]`)
        ev.emit('client-in', client.id)

        //error
        client.on('error', (err) => {
            // console.error(`Client error [${client.id}]:`, err)
            ev.emit('client-error', client.id, err)
        })

    })

    //客戶端訂閱
    broker.on('subscribe', (subscriptions, client) => {
        if (iseobj(client)) {
            // console.log('client subscribe', `client.id[${client.id}]`, `topics[${subscriptions.map(s => s.topic).join(', ')}]`)
            ev.emit('subscribe', client.id, subscriptions)
        }
    })

    //客戶端發佈訊息
    broker.on('publish', (packet, client) => {
        if (iseobj(client)) {
            // console.log('client publish', `client.id[${client.id}]`, `topic[${packet.topic}]`, `qos[${packet.qos}]`, packet.payload.toString())
            ev.emit('publish', client.id, packet.topic, packet.payload, packet.qos)
        }
    })

    //客戶端斷線
    broker.on('clientDisconnect', (client) => {
        // console.log('client out', `client.id[${client.id}]`)
        ev.emit('client-out', client.id)
    })

    //error
    broker.on('error', (err) => {
        // console.error('Broker error:', err)
        ev.emit('broker-error', err) // 也可以轉發出去
    })

    //closeBroker
    let closeBroker = () => {
        return new Promise((resolve, reject) => {
            broker.close((err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    //closeServer
    let closeServer = () => {
        return new Promise((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    }

    //clear
    let clear = async () => {
        await closeBroker()
        await closeServer()
    }

    //save
    ev.clear = clear

    return ev
}


export default WPubsubServer
