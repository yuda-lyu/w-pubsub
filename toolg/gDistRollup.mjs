import path from 'path'
import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'
import rollupWorker from 'w-package-tools/src/rollupWorker.mjs'
import getFiles from 'w-package-tools/src/getFiles.mjs'


let fdSrc = './src'
let fdTar = './dist'

async function core() {

    await rollupFiles({
        fns: ['WPubsubServer.mjs', 'WPubsubClient.mjs'],
        fdSrc,
        fdTar,
        nameDistType: 'kebabCase',
        runin: 'browser', //server剔除依賴就可使用'browser'轉譯, client即便用'browser'也因為剔除依賴可執行於nodejs
        globals: {
            'path': 'path',
            'fs': 'fs',
            'aedes': 'aedes',
            'aedes-persistence-level': 'aedes-persistence-level',
            'net': 'net',
            'level': 'level',
            'mqtt': 'mqtt',
        },
        external: [
            'path',
            'fs',
            'aedes',
            'aedes-persistence-level',
            'net',
            'level',
            'mqtt',
        ],
    })
        .catch((err) => {
            console.log(err)
        })

    await rollupWorker({
        name: 'WPubsubClient', //原模組名稱, 將來會掛於winodw下, nodejs引入後為自行決定名稱
        type: 'function', //原模組輸出為函數, 可傳入參數初始化
        execFunctionByInstance: false, //原模組為計算函數回傳結果, 故設為false使回傳結果為繼承eventemitter3物件
        funNames: [
            'subscribe',
            'unsubscribe',
            'publish',
            'clear',
        ],
        evNames: [ //由內部emit外部的函數得手動提供
            'connect',
            'reconnect',
            'message',
            'error',
            'offline',
            'close',
            'end',
        ],
        fpSrc: path.resolve(fdSrc, 'WPubsubClient.mjs'), //原始檔案路徑
        fpTar: path.resolve(fdTar, 'w-pubsub-client.wk.umd.js'), //檔案輸出路徑
        formatOut: 'umd',
        runin: 'nodejs',
        bMinify: false,
        globals: {
            'path': 'path',
            'fs': 'fs',
            'aedes': 'aedes',
            'aedes-persistence-level': 'aedes-persistence-level',
            'net': 'net',
            'level': 'level',
            'mqtt': 'mqtt',
        },
        external: [
            'path',
            'fs',
            'aedes',
            'aedes-persistence-level',
            'net',
            'level',
            'mqtt',
        ],
        mainFields: ['main'], //mqtt入口須指定main, 才能直接轉譯出給nodejs用之clinet程式
    })
        .catch((err) => {
            console.log(err)
        })

}
core()
    .catch((err) => {
        console.log(err)
    })

