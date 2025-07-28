import assert from 'assert'
import w from 'wsemi'
import WPubsubServer from '../src/WPubsubServer.mjs'
import WPubsubClientComu from '../src/WPubsubClientComu.mjs'


describe('pubsub_comu', function() {

    let testServer = async() => {
        let test = () => {
            let pm = w.genPm()

            let ms = []

            let opt = {
                port: 8081, //同時測試須使用不同port
                storage: './_db_comu', //同時測試須使用不同db
                tokens: ['token-for-test'],
            }
            let wps = new WPubsubServer(opt)
            wps.on('server-listen', (msg) => {
                // console.log('server-listen', msg)
                ms.push({ 'server-listen': msg })
            })
            wps.on('client-in', (clientId) => {
                // console.log('client-in', clientId)
                // ms.push({ 'client-in': clientId }) //client進入順序為隨機, 不儲存供測試
            })
            wps.on('client-out', (clientId) => {
                // console.log('client-out', clientId)
                // ms.push({ 'client-out': clientId }) //client進入順序為隨機, 不儲存供測試
            })
            wps.on('subscribe', (clientId, subscriptions) => {
                // console.log('subscribe', clientId, subscriptions)
                ms.push({ 'subscribe': clientId, 'subscriptions': JSON.stringify(subscriptions) })
            })
            wps.on('publish', (clientId, topic, payload, qos) => {
                // console.log('publish', clientId, topic, payload, qos)
                // ms.push({ 'publish': clientId, topic, payload, qos })//傳遞內容有隨機id, 不儲存供測試
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
        //   { 'server-listen': { port: 8081 } },
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

    let testClientA = async() => {
        let test = async () => {
            let pm = w.genPm()

            let ms = []

            let serviceName = 'service-for-A'
            let funcs = ['calc-A']
            let clientId = 'id-for-client-A'

            let opt = {
                port: 8081, //同時測試須使用不同port
                token: 'token-for-test',
                clientId,
            }
            let wpc = new WPubsubClientComu(serviceName, funcs, opt)
            // console.log('wpc', wpc)

            wpc.on('connect', () => {
                // console.log('connect')
                ms.push({ clientId: `connect` })
            })
            wpc.on('reconnect', () => {
                // console.log('reconnect')
            })
            wpc.on('offline', () => {
                // console.log('offline')
            })
            wpc.on('close', () => {
                // console.log('close')
                ms.push({ clientId: `close` })
            })
            wpc.on('end', () => {
                // console.log('end')
            })
            // wpc.on('error', (err) => {
            //     console.log('error', err)
            // })
            wpc.on('procFun', ({ func, input, pm }) => {
                // console.log('procFun', func, input)
                if (func === 'calc-A') {
                    // console.log('service calc-A input', input)
                    ms.push({ clientId: `service calc-A input`, msg: input })
                    let { p1, p2 } = input
                    let r = `${p1}+${p2}=${p1 + p2}`
                    // console.log('service calc-A output', r)
                    ms.push({ clientId: `service calc-A output`, msg: r })
                    pm.resolve(r)
                }
            })

            // let r = await wpc.reqServiceFunc('service-for-A', 'calc-A', { p1: 1, p2: 2.5 }) //不使用reqServiceFunc, 此腳本僅供B調用service
            // console.log('reqServiceFunc', r)

            setTimeout(async() => {
                await wpc.clear()
                try { //使用worker版時要另外呼叫terminate中止
                    wpc.terminate()
                }
                catch (err) {}
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
        //   { clientId: 'service calc-A input', msg: { p1: 1, p2: 2.5 } },
        //   { clientId: 'service calc-A output', msg: '1+2.5=3.5' },
        //   { clientId: 'close' }
        // ]
        return ms
    }

    let testClientB = async() => {
        let test = async () => {
            let pm = w.genPm()

            let ms = []

            let serviceName = 'service-for-B'
            let funcs = ['calc-B']

            let clientId = 'id-for-client-B'

            let opt = {
                port: 8081, //同時測試須使用不同port
                token: 'token-for-test',
                clientId,
            }
            let wpc = new WPubsubClientComu(serviceName, funcs, opt)
            // console.log('wpc', wpc)

            wpc.on('connect', () => {
                // console.log('connect')
                ms.push({ clientId: `connect` })
            })
            wpc.on('reconnect', () => {
                // console.log('reconnect')
            })
            wpc.on('offline', () => {
                // console.log('offline')
            })
            wpc.on('close', () => {
                // console.log('close')
                ms.push({ clientId: `close` })
            })
            wpc.on('end', () => {
                // console.log('end')
            })
            // wpc.on('error', (err) => {
            //     console.log('error', err)
            // })
            wpc.on('procFun', ({ func, input, pm }) => {
                // console.log('procFun', func, input)
                if (func === 'calc-B') {
                    // console.log('service calc-B input', input)
                    ms.push({ clientId: `service calc-B input`, msg: input })
                    let { p1, p2 } = input
                    let r = `${p1}/${p2}=${p1 / p2}`
                    // console.log('service calc-B output', r)
                    ms.push({ clientId: `service calc-B output`, msg: r })
                    pm.resolve(r)
                }
            })

            // console.log('reqServiceFunc [service-for-A][calc-A]...', { p1: 1, p2: 2.5 })
            ms.push({ clientId: `reqServiceFunc [service-for-A][calc-A] input`, msg: { p1: 1, p2: 2.5 } })
            let ra = await wpc.reqServiceFunc('service-for-A', 'calc-A', { p1: 1, p2: 2.5 })
            // console.log('reqServiceFunc [service-for-A][calc-A] done', ra)
            ms.push({ clientId: `reqServiceFunc [service-for-A][calc-A] output`, msg: ra })

            // console.log('reqServiceFunc [service-for-B][calc-B]...', { p1: 1, p2: 2.5 })
            ms.push({ clientId: `reqServiceFunc [service-for-B][calc-B] input`, msg: { p1: 1, p2: 2.5 } })
            let rb = await wpc.reqServiceFunc('service-for-B', 'calc-B', { p1: 1, p2: 2.5 })
            // console.log('reqServiceFunc [service-for-B][calc-B] done', rb)
            ms.push({ clientId: `reqServiceFunc [service-for-B][calc-B] output`, msg: rb })

            setTimeout(async() => {
                await wpc.clear()
                try { //使用worker版時要另外呼叫terminate中止
                    wpc.terminate()
                }
                catch (err) {}
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
        //   {
        //     clientId: 'reqServiceFunc [service-for-A][calc-A] input',
        //     msg: { p1: 1, p2: 2.5 }
        //   },
        //   { clientId: 'connect' },
        //   {
        //     clientId: 'reqServiceFunc [service-for-A][calc-A] output',
        //     msg: '1+2.5=3.5'
        //   },
        //   {
        //     clientId: 'reqServiceFunc [service-for-B][calc-B] input',
        //     msg: { p1: 1, p2: 2.5 }
        //   },
        //   { clientId: 'service calc-B input', msg: { p1: 1, p2: 2.5 } },
        //   { clientId: 'service calc-B output', msg: '1/2.5=0.4' },
        //   {
        //     clientId: 'reqServiceFunc [service-for-B][calc-B] output',
        //     msg: '1/2.5=0.4'
        //   },
        //   { clientId: 'close' }
        // ]
        return ms
    }

    let test = async() => {
        let [msServer, msClientA, msClientB] = await Promise.all([
            testServer(),
            testClientA(),
            testClientB(),
        ])
        let ms = [
            ...msServer,
            ...msClientA,
            ...msClientB,
        ]
        // fs.writeFileSync('./temp.json', JSON.stringify(ms), 'utf8')
        return ms
    }

    let ms = [{ 'server-listen': { 'port': 8081 } }, { 'subscribe': 'id-for-client-A', 'subscriptions': '[{"topic":"service-for-A:calc-A","qos":2}]' }, { 'subscribe': 'id-for-client-B', 'subscriptions': '[{"topic":"service-for-B:calc-B","qos":2}]' }, { 'subscribe': 'id-for-client-B', 'subscriptions': '[{"topic":"service-for-A:calc-A","qos":2}]' }, { 'clientId': 'connect' }, { 'clientId': 'service calc-A input', 'msg': { 'p1': 1, 'p2': 2.5 } }, { 'clientId': 'service calc-A output', 'msg': '1+2.5=3.5' }, { 'clientId': 'close' }, { 'clientId': 'reqServiceFunc [service-for-A][calc-A] input', 'msg': { 'p1': 1, 'p2': 2.5 } }, { 'clientId': 'connect' }, { 'clientId': 'reqServiceFunc [service-for-A][calc-A] output', 'msg': '1+2.5=3.5' }, { 'clientId': 'reqServiceFunc [service-for-B][calc-B] input', 'msg': { 'p1': 1, 'p2': 2.5 } }, { 'clientId': 'service calc-B input', 'msg': { 'p1': 1, 'p2': 2.5 } }, { 'clientId': 'service calc-B output', 'msg': '1/2.5=0.4' }, { 'clientId': 'reqServiceFunc [service-for-B][calc-B] output', 'msg': '1/2.5=0.4' }, { 'clientId': 'close' }]

    it(`should return '${JSON.stringify(ms)}' when run test'`, async function() {
        let r = await test()
        let rr = ms
        assert.strict.deepStrictEqual(r, rr)
    })

})
