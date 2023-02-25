## rx-file 是什么？有什么作用？

rx-file 是一个能够迅速创建模板文件的工具解决了手动创建大量文件的的困扰，

它最主要的特点就是搭配着脚手架去使用 比如我们使用 `create-react-app` 脚手架搭建的项目我们只需要在`src`文件夹下去编辑内容并添加文件就行 但是每开发一个项目就会面临的着要去手动的创建文件拷贝文件实在是不太雅观，市面有很多通用的模板但是我想这些并不能满足需求各不相同的开发人员 所以rx-file 出现了它目前能做的很有限 读取模板文件树形图然后创建文件 文件实际上还是空的.... 那 rx-file 就显得很鸡肋 “食之无味” 这是它的缺点。

## 下载

~~~shell
yarn add --dev rx-file
~~~

## 主要功能

通过 tree 命名获取目标文件的 fileTree 结构 将(fileTree)文件树转为文件路径，对于创建大量模板文件和嵌套过深的目录极为适合

## 简单使用

~~~js
const treeToFilePath = require('../lib/index')

// 传递参数可以是文件(存储摹本文件树形图)相对路径 or 文件树形图  
const rxFileResult = treeToFilePath('./template.txt')
// const rxFileResult = treeToFilePath(template)


// ./template.txt
const templateTxt = `
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`
const {generateFile} = rxFileResult

// 创建文件
generateFile()
~~~

## 教程

`treeToFilePath` 会返回两个属性和一个创建文件的方法，大多时候不需要用到属性，直接调用方法 `generateFile` 去创建文件

~~~ts
const rxFileResult = treeToFilePath('./template.txt')
const {fileMap, filePath, generateFile} = rxFileResult 
~~~

- `fileMap: Map<string, Node>`: 返回文件层级的结构
- `filePath: string[]` : 这个属性里面存储着每个文件的相对路径
- `generateFile: (root?: string, ops?: FileOptions) => Function;` 用来创建文件
  - `root`参数 root 并不是必须的 你可以忽略 他会自己创建一个名字大致长这样 `themplate-xxxxxxxx` 你可以指定它是一个文件名 或者是一个相对路径 甚至是一个绝对路径 当你指定是绝对路径的时候就要去指定第三参数为 `{rootdir: 'none'}`;
  - `ops` 参数 用来决定生成的模板文件根据什么规则


~~~ts
const ops = {
  rootdir: 'none'
}

generateFile(root, ops)
/**
 * root： 相对路径 | 绝对路径(使用时函数的第三参数必须传入 {rootdir: 'none'})
 * ops:  { rootdir: '__dirname' | 'tmpdir' | 'none' }
 * 
 * ops.rootdir 的选项
 * "__dirname" : 默认选项 用来在当前文件夹下生成
 * "tmpdir": 在 os.tmpdir 生成
 * "none": 整个参数表明你的 root 参数是一个绝对路径
 */
~~~


## 高级设置
> 一般你不需要配置这个选项，但不同命令下生成的文件树形图的格式大不相同，它为你提供了一个可选的操作的用来精准的匹配

配置项 `defaultOptions` 是非常必要的 它是基础也是核心 处理文件树形图模板的规则由它决定，大多数场合你不需要这个 当你模板文件和默认符合不一致使你需要使用。

~~~js
const defaultOptions = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "|",
};
~~~

**需要配置的属性有以下几种：**
`depth` : 文件的迭代深度当你文件夹的深度超过此就会忽略

`pathSeparator`: 生成文件路径的符号 `pathSeparator: "/"` 当处理好文件是通过这个属性来划分路径 一般来说你不要配置，默认情况下在 window 环境下为 `\\` 在 linux 环境下为 `/`

`throughTee`: 子节点的符号 `throughTee: "├──"` 表示文件(目录)处于其中一个

`endTee`: 最后一个节点的符号 `endTee: "└──"` 表示文件(目录) 为父级的最后一个

`vertical`: 孙文件的符号 `vertical: "|"` 文件or目录前有一个或多个，数量决定它的层级


不建议改动如果你改动这些，你很有可能得到错误的消息

**注意：**

`nullFlie`: 根节点没有时代替根节点名

`Dir`: 标记 目录节点

`File`: 标记 文件节点

只需要传入替换的属性比如：

~~~js
{
  endTee: '|' // 来替换默认的 endTee 属性
}

// 使用
const treeToFilePath = require('rx-file')
treeToFilePath('./xxx.txt', {endTee: '|'})

~~~

通过这样的方式来去覆盖默认的属性 


通常来说你使用的过程中最重要需要两个 `throughTee`、 `endTee` 和 `vertical` 你在使用的过程中只需要确保这三者正确就行。

## 警告⚠

使用之前你必须确认默认的符号和你的模板样式符合 `rx-file` 模块是通过正则的方式去匹配 它不是特别的智能 而且你必须遵守相应的规则 

1. 如果是最后一个文件 或者是最后一个 目录 你必须使用这样的符号 "└──" 或者你也可以去指定相应的符号 `{ endTee: "代表最后一个文件或者目录的符号"}`

2. 你需要去选择合适的文件树格式

一个文件树  它的格式是这样的 `├──` 用来代表子节点 `└──` 用来表示最后一个文件或者目录 `# `你可以在整个符号后添加注释 

~~~
home/user
├── foo.js
├── test
|  ├── bar.js # 这是一个注释
|  └── baz.js
└── bat.js
~~~

3. 目录名不允许存在 `.js` 或者 `.css` 相关的字符 当存在 `.` 字符时候就会被当成文件

4. 目录名尽量合理 不然你可能会看到它的路径 但有可能文件创建失败或者文件名不是你预期的那样

5. 如果你忽视上面两点你会得到和你预期相反的产物。

## 反馈

你可以及时的向我提出[建议或者问题](https://github.com/xiaochengzi6/rx-file/issues)


## 问题

1、模板创建好并且生成文件 修改模板 那么生成后的文件内容显示有问题

2、生成的文件的文件夹名看起来很奇怪

3、

## 趋势
通过 `rx-file` 只能得到简单的文件创建工具我想这是不能接收的它并没有降低我的工作量 我需要一种能够处理这种依赖关系的东西 也就是可以根据不同的模板往里写入一些内容等等...

比如目前有这样的模板文件需要在 index.js 中添加 app.js 和 index.scss 还有些许react的逻辑它可能是这样的

~~~js
// index.js
import ReactDOM from 'react-dom'
import App from './App.js';
import 'index.scss'

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)
~~~

开发者想忽略这样的基础的搭建直接开发，rx-file 能为其做到什么？ 我在之前了解到了关于[迈入现代 Web 开发（GMTC 2021 演讲《字节跳动的现代 Web 开发实践》全文） - 知乎][https://zhuanlan.zhihu.com/p/386607009]了解到了关于工程化的相关概念 这篇文章提出了`工程方案`这个词汇感觉非常的形象我想做的或者 rx-file 想做的就是提供工程方案的这样的角色 哈哈哈哈 有点异想天开了 大致的目标就是做出一个针对于某种方向的模板就行了。

关于模板文件的定义我个人觉得它是一种开发规范 这种规范一定是经过大量项目、开发迭代、统一的开发标准留下的精华 将其凝练提取出用于下一个项目的初始化 在其添加不一样的逻辑诞生出不同的产品

rx-file 还没有这样的能力..... 眼界决定作品 层次不够
