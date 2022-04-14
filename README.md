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
~~~

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
文件树转为文件路径分成了两个思路
>1. 先将文件属性图转为 Map 的节点
>2. 再将 Map 节点转为路径

1、先将文件属性图转为 Map 的节点
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
2、将 Map 转为路径
大致上使用了递归的方式

## 问题
你可以及时的向我提出问题或者好的建议，如果你也想参与进来那就与我速速 "delete BUG"
- [] 1、没有根节点 那么打印出来的路径显然不符合常理 
- [] 2、修改`nullFlie` \ `Dir` \ `File` 改动就会出现问题 
- [] 3、打印出来的路径只是相对路径，还需要手动的添加后变成绝对路径
- [] 4、生成路径后我希望直接生成对应的文件。
- [] 5、用户可以提供一个模板文件`.txt` 也可以提供一个字符串
- [] 6、...

- [] 一、转换成 json 文件
- [] 二、给它制作一个在线网站用于可视化的编辑
- [] 三、...

## 展望
可以说这个包没有未来，或者是前途渺茫，但毕竟是我的第一个 npm 就算使用量为 0 我也会持续的为它添枝加叶。