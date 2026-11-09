# w-pubsub
A tool for publish(pub) and subscribe(sub).

![language](https://img.shields.io/badge/language-JavaScript-orange.svg) 
[![npm version](http://img.shields.io/npm/v/w-pubsub.svg?style=flat)](https://npmjs.org/package/w-pubsub) 
[![license](https://img.shields.io/npm/l/w-pubsub.svg?style=flat)](https://npmjs.org/package/w-pubsub) 
[![npm download](https://img.shields.io/npm/dt/w-pubsub.svg)](https://npmjs.org/package/w-pubsub) 
[![npm download](https://img.shields.io/npm/dm/w-pubsub.svg)](https://npmjs.org/package/w-pubsub) 
[![jsdelivr download](https://img.shields.io/jsdelivr/npm/hm/w-pubsub.svg)](https://www.jsdelivr.com/package/npm/w-pubsub)

## Documentation
To view documentation or get support, visit [docs](https://yuda-lyu.github.io/w-pubsub/global.html).

## Installation

### Using npm(ES6 module):
```alias
npm i w-pubsub
```

### Upgrade notes (server now runs on aedes 1.x)
The server side was moved from aedes 0.51 to aedes 1.2 (0.x has unfixed security advisories, e.g. a single packet with `__proto__` or `constructor` as topic or clientId crashed the broker). The public API (`new WPubsubServer(opt)`, events, `clear()`, and the client classes) keeps its signatures; what you may need to adapt:

- **Node.js >= 20 is required** (aedes 1.x is ESM only). The UMD build (`dist/w-pubsub-server.umd.js`) loads aedes with `require`, so it needs Node.js >= 20.19 or >= 22.12 (`require(esm)`); on older Node use the ES module source.
- **Start-up is asynchronous inside, the constructor is still synchronous.** The port starts listening immediately as before; connections are held until the broker is ready, so clients may connect right after `server-listen`.
- **`clear()` now also closes the LevelDB storage**, so a new `WPubsubServer` can use the same `storage` right after `await wps.clear()` in the same process.
- **A broker that fails to start** (for example, `storage` is locked by another process) emits `broker-error` (connections are closed); it no longer ends the process with an unhandled error.
- aedes 1.x defaults: `drainTimeout` 60000 ms (a client that does not drain its socket within 60 s is disconnected) and `maxInflightInbound` 1000.
- Data written by older versions (`storage`) can be opened in place; subscriptions and offline QoS 1/2 messages are kept.
- `aedes`, `aedes-persistence` and `aedes-persistence-level` must be upgraded together (this package declares `^1.2.0`, `^11.0.0`, `^9.2.0`); the client uses `mqtt` `^5.16.1`. With `mqtt` 5.16 a client whose CONNECT is refused (for example a wrong token) gets `error` then `close` and does not reconnect automatically.

#### Example for Server:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-pubsub/blob/master/srv.mjs)]
```alias
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
        ms.push({ 'publish': clientId, topic, 'payload': payload, qos })
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
    }, 6000)

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
```

#### Example for Client:
> **Link:** [[dev source code](https://github.com/yuda-lyu/w-pubsub/blob/master/scl.mjs)]
```alias
import w from 'wsemi'
import WPubsubClient from './src/WPubsubClient.mjs'
// import WPubsubClient from './dist/w-pubsub-client.umd.js'
// import WPubsubClient from './dist/w-pubsub-client.wk.umd.js'

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
    // console.log('wpc', wpc)

    let topic = 'task'

    wpc.on('connect', () => {
        console.log('connect')
        ms.push({ clientId: `connect` })
    })
    wpc.on('reconnect', () => {
        console.log('reconnect')
    })
    wpc.on('offline', () => {
        console.log('offline')
    })
    wpc.on('message', ({ topic, message }) => {
        console.log(`message`, topic, message)
        ms.push({ clientId: `receive topic[${topic}], message[${message}]` })
    })
    wpc.on('close', () => {
        console.log('close')
        ms.push({ clientId: `close` })
    })
    wpc.on('end', () => {
        console.log('end')
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
        try { //使用worker版時要另外呼叫terminate中止
            wpc.terminate()
        }
        catch (err) {}
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
//   { clientId: 'close' }
// ]
```
