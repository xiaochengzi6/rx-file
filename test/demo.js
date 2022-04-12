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

console.log(treeTopath(target))
