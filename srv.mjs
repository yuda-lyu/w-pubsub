import w from 'wsemi'
import WPubsubServer from './src/WPubsubServer.mjs'


let test = () => {
    let pm = w.genPm()

    let ms = []

    let opt = {
        port: 8080,
        storage: './_db',
        tokens: ['token-for-test'],
    }
    let wps = new WPubsubServer(opt)
    wps.on('server-listen', (msg) => {
        console.log('server-listen', msg)
        ms.push({ 'server-listen': msg })
    })
    wps.on('client-in', (clientId) => {
        console.log('client-in', clientId)
        ms.push({ 'client-in': clientId })
    })
    wps.on('client-out', (clientId) => {
        console.log('client-out', clientId)
        ms.push({ 'client-out': clientId })
    })
    wps.on('subscribe', (clientId, subscriptions) => {
        console.log('subscribe', clientId, subscriptions)
        ms.push({ 'subscribe': clientId, 'subscriptions': JSON.stringify(subscriptions) })
    })
    wps.on('publish', (clientId, topic, payload, qos) => {
        console.log('publish', clientId, topic, payload, qos)
        ms.push({ 'publish': clientId, topic, payload, qos })
    })
    wps.on('server-error', (err) => {
        console.log('server-error', err)
    })
    wps.on('broker-error', (err) => {
        console.log('broker-error', err)
    })
    wps.on('client-error', (clientId, err) => {
        console.log('client-error', clientId, err)
    })

    setTimeout(async () => {
        await wps.clear()
        console.log('ms', ms)
        pm.resolve(ms)
    }, 11116000)

    return pm
}
await test()
    .catch((err) => {
        console.log(err)
    })
// => ms [
//   { 'server-listen': { port: 8080 } },
//   { 'client-in': 'id-for-client' },
//   {
//     subscribe: 'id-for-client',
//     subscriptions: '[{"topic":"task","qos":2}]'
//   },
//   { publish: 'id-for-client', topic: 'task', payload: 'result', qos: 2 },
//   { 'client-out': 'id-for-client' }
// ]


//node srv.mjs
