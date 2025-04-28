import rollupFiles from 'w-package-tools/src/rollupFiles.mjs'
import getFiles from 'w-package-tools/src/getFiles.mjs'


let fdSrc = './src'
let fdTar = './dist'


rollupFiles({
    fns: ['WPubsubServer.mjs', 'WPubsubClient.mjs'],
    fdSrc,
    fdTar,
    nameDistType: 'kebabCase',
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

