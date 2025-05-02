import { parentPort, workerData } from 'node:worker_threads'
import WPubsubClient from './WPubsubClient.mjs'


let opt = workerData
// let opt = {
//     port: 8080,
//     token: 'token-for-test',
//     clientId,
// }

let wpc = new WPubsubClient(opt)

wpc.on('connect', () => {
    console.log('connect')
    parentPort.postMessage({ type: 'connect' })
})
wpc.on('reconnect', () => {
    console.log('reconnect')
    parentPort.postMessage({ type: 'reconnect' })
})
wpc.on('offline', () => {
    console.log('offline')
    parentPort.postMessage({ type: 'offline' })
})
wpc.on('message', ({ topic, message }) => {
    console.log(`message`, topic, message.toString())
    parentPort.postMessage({ type: 'message', topic, message })
})
wpc.on('close', () => {
    console.log('close')
    parentPort.postMessage({ type: 'close' })
})
wpc.on('end', () => {
    console.log('end')
    parentPort.postMessage({ type: 'end' })
})
wpc.on('error', (err) => {
    console.log('error', err)
    parentPort.postMessage({ type: 'error', error: err })
})

parentPort.on('fun', (msg) => {
    // ev.subscribe = subscribe let subscribe = async(topic, qos = 2) => {
    // ev.unsubscribe = unsubscribe let unsubscribe = async(topic) => {
    // ev.publish = publish let publish = async (topic, msg, qos = 2) => {
    // ev.clear = clear let clear = () => {
    if (msg.type === 'subscribe') {
        wpc.subscribe(msg.topic, msg.qos ?? 2)
        client.subscribe(msg.topic, { qos: msg.qos ?? 0 }, (err, granted) => {
            parentPort.postMessage({ type: 'subscribed', topic: msg.topic, granted, error: err?.message })
        })
    }
    else if (msg.type === 'unsubscribe') {
        client.unsubscribe(msg.topic, (err) => {
            parentPort.postMessage({ type: 'unsubscribed', topic: msg.topic, error: err?.message })
        })
    }
    else if (msg.type === 'publish') {
        const payload = typeof msg.message === 'object' ? JSON.stringify(msg.message) : msg.message
        client.publish(msg.topic, payload, { qos: msg.qos ?? 0 }, (err) => {
            parentPort.postMessage({ type: 'published', topic: msg.topic, error: err?.message })
        })
    }
    else if (msg.type === 'end') {
        client.end()
    }
})

// const client = mqtt.connect(urlBroker, {
//     clientId,
//     username: token,
//     clean: false,
//     reconnectPeriod: timeReconnect,
// })

// // 通知主程式已連線
// client.on('connect', () => {
//     parentPort.postMessage({ type: 'connect' })
// })

// // 當收到 mqtt 訊息
// client.on('message', (topic, message) => {
//     parentPort.postMessage({ type: 'message', topic, message: message.toString() })
// })

// client.on('error', (err) => {
//     parentPort.postMessage({ type: 'error', error: err.message })
// })

// client.on('close', () => {
//     parentPort.postMessage({ type: 'close' })
// })

// // 接收主程式指令
// parentPort.on('message', (msg) => {
//     if (msg.type === 'subscribe') {
//         client.subscribe(msg.topic, { qos: msg.qos ?? 0 }, (err, granted) => {
//             parentPort.postMessage({ type: 'subscribed', topic: msg.topic, granted, error: err?.message })
//         })
//     }
//     else if (msg.type === 'unsubscribe') {
//         client.unsubscribe(msg.topic, (err) => {
//             parentPort.postMessage({ type: 'unsubscribed', topic: msg.topic, error: err?.message })
//         })
//     }
//     else if (msg.type === 'publish') {
//         const payload = typeof msg.message === 'object' ? JSON.stringify(msg.message) : msg.message
//         client.publish(msg.topic, payload, { qos: msg.qos ?? 0 }, (err) => {
//             parentPort.postMessage({ type: 'published', topic: msg.topic, error: err?.message })
//         })
//     }
//     else if (msg.type === 'end') {
//         client.end()
//     }
// })
