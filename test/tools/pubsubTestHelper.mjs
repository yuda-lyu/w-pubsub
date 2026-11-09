import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import WPubsubServer from '../../src/WPubsubServer.mjs'
import WPubsubClient from '../../src/WPubsubClient.mjs'


//整合測試共用輔助: 本機起broker與client, 不連外; 以事件同步(不以固定延時偵測), 僅以逾時防止懸置

let dirTools = path.dirname(fileURLToPath(import.meta.url))


//getTmpDir, 測試中之臨時資料一律放test/_tmp/<案名>/
function getTmpDir(name) {
    return path.resolve(dirTools, '..', '_tmp', name)
}


//cleanDir, 刪除臨時資料夾(不存在亦可)
function cleanDir(dir) {
    fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}


//waitEvent, 等待ev發出name事件(可帶判斷函數pred), 逾時ms僅為防止懸置, 回傳該事件之參數陣列
function waitEvent(ev, name, opt = {}) {
    let pred = opt.pred || (() => true)
    let ms = opt.ms || 30000
    return new Promise((resolve, reject) => {
        let timer = null
        let h = (...args) => {
            if (!pred(...args)) {
                return
            }
            clearTimeout(timer)
            ev.off(name, h)
            resolve(args)
        }
        timer = setTimeout(() => {
            ev.off(name, h)
            reject(new Error(`timeout waiting event[${name}] in ${ms}ms`))
        }, ms)
        ev.on(name, h)
    })
}


//makeInbox, 收集client之message事件
//waitCount(n)等待累計收到n筆, waitMatch(pred)等待收到符合pred之訊息(已收到者亦算), 兩者皆回傳當下全部訊息之副本
function makeInbox(wpc) {
    let msgs = []
    let waiters = []
    let check = () => {
        waiters = waiters.filter((w) => {
            if (w.ok()) {
                clearTimeout(w.timer)
                w.resolve(msgs.slice())
                return false
            }
            return true
        })
    }
    wpc.on('message', (m) => {
        msgs.push(m)
        check()
    })
    let wait = (ok, desc, ms) => {
        return new Promise((resolve, reject) => {
            if (ok()) {
                return resolve(msgs.slice())
            }
            let w = { ok, resolve, timer: null }
            w.timer = setTimeout(() => {
                waiters = waiters.filter((x) => x !== w)
                reject(new Error(`timeout waiting ${desc} in ${ms}ms, got ${msgs.length}: ${JSON.stringify(msgs)}`))
            }, ms)
            waiters.push(w)
        })
    }
    let waitCount = (n, ms = 30000) => {
        return wait(() => msgs.length >= n, `${n} messages`, ms)
    }
    let waitMatch = (pred, ms = 30000) => {
        return wait(() => msgs.some(pred), 'matched message', ms)
    }
    return { msgs, waitCount, waitMatch }
}


//waitServerSubscribed, 等到server端已確認clientId訂閱了topic; 先查startServer紀錄之事件, 無才等待(查與掛監聽之間無await, 不會漏)
async function waitServerSubscribed(srv, clientId, topic, ms) {
    let isSub = (id, subscriptions) => {
        return id === clientId && subscriptions.some((s) => s.topic === topic)
    }
    let has = srv.events.some((e) => {
        return e.type === 'subscribe' && isSub(e.clientId, e.subscriptions)
    })
    if (!has) {
        await waitEvent(srv.wps, 'subscribe', { pred: isSub, ms })
    }
}


//startServer, 啟動WPubsubServer並等到server-listen, 回傳{ wps, events, errors }
//events為server端事件(client-in,client-out,subscribe,publish)依序紀錄, errors為server-error,broker-error,client-error之紀錄
async function startServer(opt) {
    let wps = new WPubsubServer(opt)
    let events = []
    let errors = []
    wps.on('client-in', (clientId) => {
        events.push({ type: 'client-in', clientId })
    })
    wps.on('client-out', (clientId) => {
        events.push({ type: 'client-out', clientId })
    })
    wps.on('subscribe', (clientId, subscriptions) => {
        events.push({ type: 'subscribe', clientId, subscriptions })
    })
    wps.on('publish', (clientId, topic, payload, qos) => {
        events.push({ type: 'publish', clientId, topic, payload, qos })
    })
    wps.on('server-error', (err) => {
        errors.push({ type: 'server-error', err })
    })
    wps.on('broker-error', (err) => {
        errors.push({ type: 'broker-error', err })
    })
    wps.on('client-error', (clientId, err) => {
        errors.push({ type: 'client-error', clientId, err })
    })
    await waitEvent(wps, 'server-listen')
    return { wps, events, errors }
}


//startClient, 建立WPubsubClient並附收件匣, 回傳{ wpc, inbox, errors }, 需連線完成者另以waitEvent(wpc, 'connect')等待
function startClient(opt) {
    let wpc = new WPubsubClient(opt)
    let inbox = makeInbox(wpc)
    let errors = []
    wpc.on('error', (err) => {
        errors.push(err)
    })
    return { wpc, inbox, errors }
}


//startClientConnected, 建立client並等到connect
async function startClientConnected(opt) {
    let c = startClient(opt)
    await waitEvent(c.wpc, 'connect')
    return c
}


export {
    getTmpDir,
    cleanDir,
    waitEvent,
    makeInbox,
    waitServerSubscribed,
    startServer,
    startClient,
    startClientConnected
}
