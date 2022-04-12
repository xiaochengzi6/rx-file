## 主要功能
~~~js
`
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`
// -----||-----
// -----||-----
// -----vv-----
// 变成这样
`
'home/user/foo.js',
'home/user/test/bar.js',
'home/user/test/baz.js',
'home/user/bat.js'
`
~~~

## 使用
~~~js
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

[
  'home/user/foo.js',
  'home/user/test/bar.js',
  'home/user/test/baz.js',
  'home/user/bat.js'
]

console.log(treeTopath(target))

## 高级使用
`index.js`文件导出了一个使用函数和一个配置对象默认使用以下对象
~~~js
let DEFAULT_OPTIONS = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  pathSeparator: "/",
  sequences: {
    throughTee: "├──",
    endTee: "└──",
    vertical: "|  ",
    emptyColumn: "   ",
  },
};
~~~
不建议改动如果你改动这些，你很有可能得到错误的消息
`nullFlie`: 根节点没有时代替根节点名
`Dir`: 标记 目录节点
`File`: 标记 文件节点

可配置
`pathSeparator`: 生成文件路径的符号
`sequences`: 符号对象主要是自由选择切割文件树的符号
`throughTee`: 子节点的符号
`endTeez`: 最后一个节点的符号
`vertical`: 孙文件的符号
`emptyColumn` 空白符

## 基本算法
~~~js
// 1.0先切分成一个一个的（行切分每一行都会切分成一个元素保存在数组中）
// 1.先找到根节点并记录为 0
// 2.1、找一级目录或者文件
// 2.1.1、如果查找到是文件就直接保存在 根节点中
// 3.2、如果是目录要遍历并且记录下当前的节点作为 “根” 来保存文件 这里实现一个遍历
// 4.1 保存目录直接的关系先记录当前的根目录，然后将其记录为 1
// 4.1.1 如果找到的是目录就要保存信息为 2
// 4.1.1.1 如果其下有文件就要通过 2 来存储在 2 下
// 4.1.1.2 没有文件不用保存节点信息，直接来进行下一步
// 4.2 如果是文件就要保存存在 1
// 4.2.1 没有文件那么就会退出 并弹出 1
// 4.3 还有目录就要再 进行 4.1.1 - 4.1.1.2 的变化。
// 4.4 没有文件要保存就会弹出 根文件
// 4.5 结束
~~~