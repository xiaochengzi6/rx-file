// const getFilepath = require('rx-file')
const {treeTopath}= require('../index')

console.log(treeTopath)
const target = `
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`.trim();

// [
//   'home/foo.js',
//   'home/test/bar.js',
//   'home/test/baz.js',
//   'home/bat.js'
// ]

let a = new Map()
a.set('w','s')
a.set('1','sss')
console.log(a)
console.log(a.size)
// console.log(treeTopath(target))
