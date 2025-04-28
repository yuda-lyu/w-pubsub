import w from 'wsemi'
import WPubsubClient from './src/WPubsubClient.mjs'


let test = async () => {
    let pm = w.genPm()

    let ms = []

    let clientId = 'id-for-client'

    let opt = {
        port: 8080,
        token: 'token-for-test',
        clientId,
    }
    let wpc = new WPubsubClient(opt)

    let topic = 'task'

    wpc.on('connect', () => {
        console.log('connect')
        ms.push({ clientId: `connect` })
    })
    wpc.on(topic, (msg) => {
        console.log(`topic[${topic}]`, msg.toString())
        ms.push({ clientId: `receive topic[${topic}]` })
    })
    wpc.on('close', () => {
        console.log('close')
        ms.push({ clientId: `close` })
    })
    wpc.on('error', (err) => {
        console.log('error', err)
    })

    await wpc.subscribe(topic, 2)
        .then((res) => {
            console.log('subscribe then', res)
            ms.push({ clientId: `subscribe`, subscriptions: JSON.stringify(res) })
        })
        .catch((err) => {
            console.log('subscribe catch', err)
        })

    await wpc.publish(topic, 'result', 2)
        .then((res) => {
            console.log('publish then', res)
            ms.push({ clientId: `publish`, res })
        })
        .catch((err) => {
            console.log('publish catch', err)
        })

    setTimeout(async() => {
        await wpc.clear()
        console.log('ms', ms)
        pm.resolve(ms)
    }, 5000)

    return pm
}
await test()
    .catch((err) => {
        console.log(err)
    })
// => ms [
//   { clientId: 'connect' },
//   {
//     clientId: 'subscribe',
//     subscriptions: '[{"topic":"task","qos":2}]'
//   },
//   { clientId: 'publish', res: 'done' },
//   { clientId: 'receive topic[task]' },
//   { clientId: 'close' },
//   { clientId: 'close' }
// ]


//node scl.mjs
