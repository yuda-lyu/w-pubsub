import w from 'wsemi'
import WPubsubClientComu from './src/WPubsubClientComu.mjs'
// import WPubsubClientComu from './dist/w-pubsub-client-comu.umd.js'
// import WPubsubClientComu from './dist/w-pubsub-client-comu.wk.umd.js'


let test = async () => {
    let pm = w.genPm()

    let ms = []

    let serviceName = 'service-for-A'
    let funcs = ['calc-A']

    let clientId = 'id-for-client-A'

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
        if (func === 'calc-A') {
            console.log('service calc-A input', input)
            ms.push({ clientId: `service calc-A input`, msg: input })
            let { p1, p2 } = input
            let r = `${p1}+${p2}=${p1 + p2}`
            console.log('service calc-A output', r)
            ms.push({ clientId: `service calc-A output`, msg: r })
            pm.resolve(r)
        }
    })

    let r = await wpc.reqServiceFunc('service-for-A', 'calc-A', { p1: 1, p2: 2.5 }) //不使用reqServiceFunc, 此腳本僅供B調用service
    console.log('reqServiceFunc', r)

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
//   { clientId: 'service calc-A input', msg: { p1: 1, p2: 2.5 } },
//   { clientId: 'service calc-A output', msg: '1+2.5=3.5' },
//   { clientId: 'close' }
// ]


//node sclca.mjs
