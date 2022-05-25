## rx-file 是什么？有什么作用？
rx-file 是一个能够迅速创建模板文件的工具它的出现可以说是解决了开发者手动创建大量文件的的困扰，对于创建大量模板文件和嵌套过深的目录极为适合。

它最主要的特点就是搭配着脚手架去使用 比如我们使用 `create-react-app` 脚手架搭建的项目我们只需要在`src`文件夹下去编辑内容并添加文件就行 但是每开发一个项目就会面临的着要去手动的创建文件拷贝文件实在是不太雅观，市面有很多通用的模板(需要手动检索/下载)但是我想这些并不能满足需求各不相同的开发人员 所以 `rx-file` 出现了。 
**缺点：** 它目前能做的很有限 读取模板文件树形图然后创建文件 文件实际上还是空的.... 那 rx-file 就显得很鸡肋 “食之无味” 这是它的最大弊端，你需要仔细的考虑是否要用这样的文件。

## 下载
~~~shell
yarn add --dev rx-file
~~~

## 主要功能
1、将文件模板转为 Map 对象

2、将文件关系的 Map 对象转为 文件路径数组

3、将文件路径数组生成文件



## 入门使用

为了方便我们去创建一个 `Template.txt` 的文件里面存有模板文件的格式

~~~txt
├── /Application  # 项目页面
├── /components   # 公共组件
├── /api          # 请求
├── /store        # 状态管理
├── /utils        # 工具函数、常量
├── /types
├── /assets       # 静态资源
├── /router       # 路由       
├── index.js
└── App.js
~~~

在 `index.js` 文件写入以下内容
~~~js
// index.js
const {main} = require("rx-file");
const build = main('./Template.txt')
build.FileNode        // 得到的是文件的 map 格式   -----值
build.FilePathArrs    // 得到文件的数组            -----值
build.generFile('filename', options)       // 生成文件                -----函数
~~~

> 值得注意的是你如果使用 path.join(__dirname, 'Template.txt') 的方式往 main 函数中传值就会发生错误。main 现阶段不能智能的识别这些路径的格式 目前你可以往里面传入的模板字符串或者是一个路径


使用 `main` 会导出一个对象这个对象就包含了三个值 

一个 map 对象

一个数组对象
 
一个函数 

这三个恰好对应这 `rx-file` 的三个功能 你可以在这个基础上二次开发也可以对其处理

比如：你不想生成某一个文件 你可以得到 `FilePathArrs` 同时对其做出一定的处理使其排除掉你不想要的文件名

需要注意的是 `build.generFile(fileName(必填), options(选填))` 这个函数 它接收一个文件名 用来承载模板文件 和一个配置对象 你在大多数的情况下不要要在意这个 你可以忽视 

**（选填）options**:  { rootdir: '__dirname' | 'tmpdir' | 'none' }

**options** 的选项

1. "**__dirname**" : 默认选项 用来在当前文件夹 下生成

2.  "**tmpdir**": 在 os.tmpdir 生成

3. "**none**": 整个参数表明你的 root 参数是一个绝对路径


> 到此就入门教程就结束了 如果出现了些许问题你可以继续往下阅读

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

5. 目录名尽量合理 不然你可能会看到它的路径 但有可能文件创建失败或者文件名不是你预期的那样

6. 如果你忽视上面两点你会得到和你预期相反的产物。

## 反馈
你可以及时的向我提出[建议或者问题][https://github.com/xiaochengzi6/rx-file/issues]


## 配置项 default_must 
配置项是非常必要的 它是你划分文件模板的核心 处理模板的规则由它决定，大多数场合你不需要这个 当你模板文件和默认符合不一致使你需要使用。你必须小心处理一旦你错误使用你可能得不到你想要的值

`default_options`: 
~~~js
let DEFAULT_OPTIONS = {
  RootFlie: "NULLFILE",
  inheritRootfile: false,
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "│",
};
~~~
不建议改动如果你改动这些，你很有可能得到错误的消息

**不建议动改动这些东西**

`nullFlie`: 根节点没有时代替根节点名

`Dir`: 标记 目录节点

`File`: 标记 文件节点

**可配置**
`inheritRootfile`: 模板文件中可能存在一个根节点文件目录 这个配置选项 默认不继承根节点文件夹也就是说会忽视 根节点文件夹 或者  `nullFlie` 

> 准确的说是忽视 根文件夹 的文件名 创建文件关系的时候不会创建它

~~~js
react-template
├── public 
├── src
│ ├── assets 
│ │ ├── fonts 
│ │ ├── images 
~~~

其中根文件夹是 `react-template` 不过创建文件的时候只会创建这样形式的 你的根文件 会由你的生成函数的 `main.generFile(root, options)` 的 root 也就是你的第一个参数去代替。

~~~
├── public 
├── src
│ ├── assets 
│ │ ├── fonts 
│ │ ├── images 
~~~

`depth` : 文件的迭代深度当你文件夹的深度超过此就会忽略

`pathSeparator`: 生成文件路径的符号

`throughTee`: 子节点的符号

`endTee`: 最后一个节点的符号

`vertical`: 孙文件的符号


配置项采用的是与默认配置合并的方式你需要做到就是找到不同的配置项 然后将其传入：
~~~js
{
  endTee: '|' // 来替换默认的 endTee 属性
}

// 使用

const {main} = require('rx-file')
const bundle = main('./xxx.txt', {endTee: '|'})


// 或者

const {treePath} = require('rx-file')
treePath('./xxx.txt', {endTee: '|'})


 
~~~
通过这样的方式来去覆盖默认的属性 


通常来说你使用的过程 `throughTee`、 `endTee` 和 `vertical`只需要确保这三者匹配正确就行。

## 大致结构

`main` 函数会导出 三个值都是由 三个函数运行得到的 你需要在`高级使用`中看到如何使用 先简单看一下

1、`create` 函数    生成一个 map 对象

2、`treePath` 函数  生成一个数组对象

3、`fileMap` 函数   生成模板文件

这些都由 `rx-file` 导出
~~~js
module.exports = {
  main,
  create,
  treePath,
  fileMap,
  default_must,
};
~~~

## API 高级使用

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

2.  "**tmpdir**": 在 os.tmpdir 生成

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

