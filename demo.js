const getFilepath = require('./index')

const target = `
home
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`.trim();

// `
// 'home/user/foo.js',
// 'home/user/test/bar.js',
// 'home/user/test/baz.js',
// 'home/user/bat.js'
// `;

console.log(getFilepath(target))