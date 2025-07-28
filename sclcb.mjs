import w from 'wsemi'
// import WPubsubClientComu from './src/WPubsubClientComu.mjs'
// import WPubsubClientComu from './dist/w-pubsub-client-comu.umd.js'
import WPubsubClientComu from './dist/w-pubsub-client-comu.wk.umd.js'


let test = async () => {
    let pm = w.genPm()

    let ms = []

    let serviceName = 'service-for-B'
    let funcs = ['calc-B']

    let clientId = 'id-for-client-B'

    let opt = {
        port: 8080,
        token: 'token-for-test',
        clientId,
    }
    let wpc = new WPubsubClientComu(serviceName, funcs, opt)

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
    wpc.on('procFun', ({ func, input, pm }) => {
        console.log('procFun', func, input)
        if (func === 'calc-B') {
            console.log('service calc-B input', input)
            ms.push({ clientId: `service calc-B input`, msg: input })
            let { p1, p2 } = input
            let r = `${p1}/${p2}=${p1 / p2}`
            console.log('service calc-B output', r)
            ms.push({ clientId: `service calc-B output`, msg: r })
            pm.resolve(r)
        }
    })

    console.log('reqServiceFunc [service-for-A][calc-A]...', { p1: 1, p2: 2.5 })
    ms.push({ clientId: `reqServiceFunc [service-for-A][calc-A] input`, msg: { p1: 1, p2: 2.5 } })
    let ra = await wpc.reqServiceFunc('service-for-A', 'calc-A', { p1: 1, p2: 2.5 })
    console.log('reqServiceFunc [service-for-A][calc-A] done', ra)
    ms.push({ clientId: `reqServiceFunc [service-for-A][calc-A] output`, msg: ra })

    console.log('reqServiceFunc [service-for-B][calc-B]...', { p1: 1, p2: 2.5 })
    ms.push({ clientId: `reqServiceFunc [service-for-B][calc-B] input`, msg: { p1: 1, p2: 2.5 } })
    let rb = await wpc.reqServiceFunc('service-for-B', 'calc-B', { p1: 1, p2: 2.5 })
    console.log('reqServiceFunc [service-for-B][calc-B] done', rb)
    ms.push({ clientId: `reqServiceFunc [service-for-B][calc-B] output`, msg: rb })

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


//node sclcb.mjs
