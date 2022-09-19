## rx-file 是什么？有什么作用？

rx-file 是一个能够迅速创建模板文件的工具它的出现可以说是解决了开发者手动创建大量文件的的困扰，

它最主要的特点就是搭配着脚手架去使用 比如我们使用 `create-react-app` 脚手架搭建的项目我们只需要在`src`文件夹下去编辑内容并添加文件就行 但是每开发一个项目就会面临的着要去手动的创建文件拷贝文件实在是不太雅观，市面有很多通用的模板但是我想这些并不能满足需求各不相同的开发人员 所以rx-file 出现了它目前能做的很有限 读取模板文件树形图然后创建文件 文件实际上还是空的.... 那 rx-file 就显得很鸡肋 “食之无味” 这是它的缺点。

## 下载

~~~shell
yarn add --dev rx-file
~~~

## 主要功能

将文件树转为文件路径，对于创建大量模板文件和嵌套过深的目录极为适合

## 简单使用

~~~js
const {treePath}= require('rx-file')

const target = `
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`
treePath(target)
// ------output------------
[
  'home/user/foo.js',
  'home/user/test/bar.js',
  'home/user/test/baz.js',
  'home/user/bat.js'
]
~~~

## 教程

`rx-file` 会提供三个函数和一个配置对象，来供你使用,依次介绍一下

1、`fileMap()`: 这个函数用于将字符串或者模板文件的路径 转成涵盖文件之间关系的对象,它是最基础的函数
参数 options 是配置项 注意下文有讲解 你可能非常需要 它是关键

~~~js
fileMap(string|filePath, options) => fileNode{/*....*/}

~~~

**使用案例：**

~~~
# 假设我有一个 template.txt 里面涵盖有这些内容
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
~~~

~~~js
// 我们开始使用
const {fileMap} = require('rx-file');
const map = fileMap('./template.txt')
console.log(map)
// ...
~~~

2、`treePath()`: 这个函数会接收模板文件的路径或者是涵盖文件之间关系的对象,返回一个包含文件路径的数组

参数 options 是配置项 注意下文有讲解 你可能非常需要 它是关键

~~~js
treePath(filePath|fileNode, options) => path[]
~~~

**使用案例：**

~~~js
// 接着上面的例子 
const {fileMap, treePath} = require('rx-file');
const map = fileMap('./template.txt')
var pathArr = treePath(map)
console.log(pathArr)

// 或者
var pathArr = treePath('./template.txt')
console.log(pathArr)
~~~

3、`create()`: 这个函数会接收三个参数 `root` `filepath` 和 `{}` 

root 并不是必须的 你可以忽略 他会自己创建一个名字大致长这样 `themplate-xxxxxxxx` 你可以指定它是一个文件名 或者是一个相对路径 甚至是一个绝对路径 当你指定是绝对路径的时候就要去指定第三参数为 `{rootdir: 'none'}`;

**templateArray**： 模板路径 是一个数组

**options**:  { rootdir: '__dirname' | 'tmpdir' | 'none' }

**options** 的选项

1. "**__dirname**" : 默认选项 用来在当前文件夹 下生成

2. "**tmpdir**": 在 os.tmpdir 生成

3. "**none**": 整个参数表明你的 root 参数是一个绝对路径

**使用案例：**

~~~js
const path = require("path");
const main = require("rx-file");

console.log(main)

let b = main.treePath('./template.txt') /*用于生成文档路径*/

/**
 * root： 相对路径 | 绝对路径(使用时函数的第三参数必须传入 {rootdir: 'none'})
 * templateArray： 模板路径 是一个数组
 * options:  { rootdir: '__dirname' | 'tmpdir' | 'none' }
 * 
 * options 的选项
 * "__dirname" : 默认选项 用来在当前文件夹下生成
 * "tmpdir": 在 os.tmpdir 生成
 * "none": 整个参数表明你的 root 参数是一个绝对路径
 */
let map = main.create('template', b, { rootdir: '__dirname'})
console.log(b) 
console.log(map) 
~~~

## 配置项

配置项是非常必要的 它是基础也是核心 处理模板的规则由它决定，大多数场合你不需要这个 当你模板文件和默认符合不一致使你需要使用。

`default_options`: 

~~~js
let DEFAULT_OPTIONS = {
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

不建议改动如果你改动这些，你很有可能得到错误的消息

**不建议动改动这些东西**

`nullFlie`: 根节点没有时代替根节点名

`Dir`: 标记 目录节点

`File`: 标记 文件节点

**可配置**

`depth` : 文件的迭代深度当你文件夹的深度超过此就会忽略

`pathSeparator`: 生成文件路径的符号

`throughTee`: 子节点的符号

`endTee`: 最后一个节点的符号

`vertical`: 孙文件的符号


你如果需要你只需要传入你认为你应该需要的属性就行比如：

~~~js
{
  endTee: '|' // 来替换默认的 endTee 属性
}

// 使用

const {treePath} = require('rx-file')
treePath('./xxx.txt', {endTee: '|'})

~~~

通过这样的方式来去覆盖默认的属性 


通常来说你使用的过程中最重要需要两个 `throughTee`、 `endTee` 和 `vertical` 你在使用的过程中只需要确保这三者正确就行。

## 生成模板文件路径

你可以将文件树形图以字符串的方式传入不过通常都是使用模板文件来去构建 我们需要创建一个名为 `template.txt`的文件 往里面塞入准备好的文件树

这里使用了他的文件树但又做了些改动[这里](https://juejin.cn/post/7003257639199064100)

~~~
react-template
├── public # 存放html模板
├── src
│ ├── assets # 存放会被 Webpack 处理的静态资源文件：一般是自己写的 js、css 或者图片等静态资源
│ │ ├── fonts # iconfont 目录
│ │ ├── images # 图片资源目录
│ │ ├── css # 全局样式目录
│ │ │  ├── common.scss # 全局通用样式目录
│ │ │  ├── core.scss # 全局sass 变量目录,直接使用，不需要引用，全局已统一引入。
│ │ │  └── init.scss # 全局初始化css
│ │ └── js # 全局js
│ ├── common # 存放项目通用文件
│ │ ├── Resolution.js # 布局适配配置中心
│ │ └── AppContext.js # 全局App上下文
│ ├── components # 项目中通用的业务组件目录
│ ├── config # 项目配置文件
│ ├── pages # 项目页面目录
│ ├── types # 项目中声明文件
│ │ ├── service # 项目中服务相关声明文件
│ │ ├── enum.js # 项目中枚举类型
│ │ ├── IContext.js  # 全局App上下文声明
│ │ ├── IRedux.js # redux相关声明
│ │ └── IRouterPage.js # 路由相关声明
│ ├── uiLibrary # 组件库
│ ├── routes # 路由目录
│ │ ├── index.js # 路由配置入口文件
│ │ └── RouterUI.js # 路由转换
│ ├── store # redux 仓库
│ │ ├── actionCreaters # action创建与分发绑定
│ │ ├── action  # 项目中action
│ │ ├── reducers  # 项目中reducers
│ │ │  └──history # 项目中路由相关history
│ │ ├── index.ts # 全局 store 获取
│ │ └── connect.ts # react 页面与store 连接
│ ├── utils # 全局通用工具函数目录
│ ├── App.js # App全局
│ ├── index.js # 项目入口文件
│ └── index.scss # 项目入口引入的scss
~~~

然后下载  `yarn add --dev rx-file`

~~~js
const path = require("path");
const main = require("rx-file");

// 第一种
let a = main.fileMap('./template.txt')/*返回一个对象 包含了文件之间的关系 */
let b = main.treePath(a) /*接收文件的路径或者是接收文件路径数组  用于生成文档路径*/
// console.log(a)
// console.log(b)

// or 第二种
let b = main.treePath('./template.txt') /*用于生成文档路径*/
console.log(b) 
~~~


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

解决依赖性的问题 比如我现在使用的是 react 技术栈但是我通过 `rx-file` 只能得到简单的文件创建工具我想这是不能接收的它并没有降低我的工作量 我需要一种能够处理这种依赖关系的东西 

~~~
react-template
├── public # 存放html模板
├── src
│ ├── assets # 存放会被 Webpack 处理的静态资源文件：一般是自己写的 js、css 或者图片等静态资源
│ │ ├── fonts # iconfont 目录
│ │ ├── images # 图片资源目录
│ │ ├── css # 全局样式目录
│ │ │  ├── common.scss # 全局通用样式目录
│ │ │  ├── core.scss # 全局sass 变量目录,直接使用，不需要引用，全局已统一引入。
│ │ │  └── init.scss # 全局初始化css
│ │ └── js # 全局js
│ ├── common # 存放项目通用文件
│ │ ├── Resolution.js # 布局适配配置中心
│ │ └── AppContext.js # 全局App上下文
│ ├── components # 项目中通用的业务组件目录
│ ├── config # 项目配置文件
│ ├── pages # 项目页面目录
│ ├── types # 项目中声明文件
│ │ ├── service # 项目中服务相关声明文件
│ │ ├── enum.js # 项目中枚举类型
│ │ ├── IContext.js  # 全局App上下文声明
│ │ ├── IRedux.js # redux相关声明
│ │ └── IRouterPage.js # 路由相关声明
│ ├── uiLibrary # 组件库
│ ├── routes # 路由目录
│ │ ├── index.js # 路由配置入口文件
│ │ └── RouterUI.js # 路由转换
│ ├── store # redux 仓库
│ │ ├── actionCreaters # action创建与分发绑定
│ │ ├── action  # 项目中action
│ │ ├── reducers  # 项目中reducers
│ │ │  └──history # 项目中路由相关history
│ │ ├── index.ts # 全局 store 获取
│ │ └── connect.ts # react 页面与store 连接
│ ├── utils # 全局通用工具函数目录
│ ├── App.js # App全局
│ ├── index.js # 项目入口文件
│ └── index.scss # 项目入口引入的scss

~~~

比如目前有这样的模板文件我们需要在 index.js 中添加 app.js 和 index.scss 还有些许react的逻辑它看起是这样的

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
