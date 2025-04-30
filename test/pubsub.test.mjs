import assert from 'assert'
import fs from 'fs'
import _ from 'lodash-es'
import w from 'wsemi'
import WPubsubServer from '../src/WPubsubServer.mjs'
import WPubsubClient from '../src/WPubsubClient.mjs'


describe('pubsub', function() {

    let testServer = async() => {
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
                // console.log('server-listen', msg)
                ms.push({ 'server-listen': msg })
            })
            wps.on('client-in', (clientId) => {
                // console.log('client-in', clientId)
                ms.push({ 'client-in': clientId })
            })
            wps.on('client-out', (clientId) => {
                // console.log('client-out', clientId)
                ms.push({ 'client-out': clientId })
            })
            wps.on('subscribe', (clientId, subscriptions) => {
                // console.log('subscribe', clientId, subscriptions)
                ms.push({ 'subscribe': clientId, 'subscriptions': JSON.stringify(subscriptions) })
            })
            wps.on('publish', (clientId, topic, payload, qos) => {
                // console.log('publish', clientId, topic, payload.toString(), qos)
                ms.push({ 'publish': clientId, topic, 'payload': payload.toString(), qos })
            })
            // wps.on('server-error', (err) => {
            //     console.log('server-error', err)
            // })
            // wps.on('broker-error', (err) => {
            //     console.log('broker-error', err)
            // })
            // wps.on('client-error', (clientId, err) => {
            //     console.log('client-error', clientId, err)
            // })

            setTimeout(async () => {
                await wps.clear()
                // console.log('ms', ms)
                pm.resolve(ms)
            }, 6000)

            return pm
        }
        let ms = await test()
        // .catch((err) => {
        //  console.log(err)
        // })
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
        return ms
    }

    let testClient = async() => {
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
                // console.log('connect')
                ms.push({ clientId: `connect` })
            })
            wpc.on(topic, (msg) => {
                // console.log(`topic[${topic}]`, msg.toString())
                ms.push({ clientId: `receive topic[${topic}]` })
            })
            wpc.on('close', () => {
                // console.log('close')
                ms.push({ clientId: `close` })
            })
            // wpc.on('error', (err) => {
            //     console.log('error', err)
            // })

            await wpc.subscribe(topic, 2)
                .then((res) => {
                    // console.log('subscribe then', res)
                    ms.push({ clientId: `subscribe`, subscriptions: JSON.stringify(res) })
                })
                // .catch((err) => {
                //     console.log('subscribe catch', err)
                // })

            await wpc.publish(topic, 'result', 2)
                .then((res) => {
                    // console.log('publish then', res)
                    ms.push({ clientId: `publish`, res })
                })
                // .catch((err) => {
                //     console.log('publish catch', err)
                // })

            setTimeout(async() => {
                await wpc.clear()
                // console.log('ms', ms)
                pm.resolve(ms)
            }, 5000)

            return pm
        }
        let ms = await test()
        // .catch((err) => {
        //     console.log(err)
        // })
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
        return ms
    }

    let test = async() => {
        let [msServer, msClient] = await Promise.all([
            testServer(),
            testClient()
        ])
        let ms = [
            ...msServer,
            ...msClient,
        ]
        // fs.writeFileSync('./temp.json', JSON.stringify(ms), 'utf8')
        return ms
    }

    let ms = [{ 'server-listen': { 'port': 8080 } }, { 'client-in': 'id-for-client' }, { 'subscribe': 'id-for-client', 'subscriptions': '[{"topic":"task","qos":2}]' }, { 'publish': 'id-for-client', 'topic': 'task', 'payload': 'result', 'qos': 2 }, { 'client-out': 'id-for-client' }, { 'clientId': 'connect' }, { 'clientId': 'subscribe', 'subscriptions': '[{"topic":"task","qos":2}]' }, { 'clientId': 'publish', 'res': 'done' }, { 'clientId': 'receive topic[task]' }, { 'clientId': 'close' }]

    it(`should return '${JSON.stringify(ms)}' when run test'`, async function() {
        let r = await test()
        let rr = ms
        assert.strict.deepStrictEqual(r, rr)
    })

})
