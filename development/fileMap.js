const {
  Node,
  Stringslice,
  root,
  isdir,
  getFileOrDirName,
  hasList,
  hasLastElement,
  returnDepth,
  isFile,
  elementSplit,
  readfile,
  hasgrandElement,
  default_must /*默认配置*/
} = require("./utils.js")

var stack = [] // 记录目录
var deptch = [] // 记录深度

module.exports = main

function main(str, ops) {
  if (typeof ops == null ){
    ops = default_must
  } else {
    // 浅拷贝
    ops = Object.assign({}, default_must, ops)
  }
  if (!typeof str == "string") {
    throw Error("Parameter must specify the form of a string")
  }

  str = str.trim()
  let target
  
  // 读取文件中树状图
  if (isFile(str, ops)) {
    try {
      str = readfile(str)
    } catch (err) {
      throw Error("Wrong file path")
    }
  }
  
  // 将树状图 “按行切分”
  target = Stringslice(str)
  // 获得 父节点
  const nodeRoot = root(target, ops)
  stack.push(nodeRoot)
  forEachTarget(target, ops)

  return stack
}
// 遍历
function forEachTarget(targets, ops) {
  // let index = stack.length - 0
  for (let i = -1; i < targets.length; i++) {
    let target = targets[i]
    /*进行微小处理：# 或"//" 都会被忽略。并且每行的空字符串将会被忽视*/
    target = elementSplit(target)

    // 主遍历
    child(target, ops)
  }
}

function child(target, ops) {
  if (target == null) {return void 0}

  const [targetElement, dirlength] = returnDepth(target, ops)
  // 查看是否是子元素（子目录或者子文件
  const ischildrenElement = hasList(targetElement, ops) /*子节点*/
  /*孙节点*/
  let isgrandElement = ischildrenElement
    ? false
    : hasgrandElement(target, ops)

  /**
   * todo 问题 --> 解决
   * 有点混乱了 这里应该要通过文件的深度或者是目录的深度来保存
   * 简直不可能，要判断很多 比如 是一个目录 但不是最后一个目录 是上一层次的目录 这种关系几乎要通过 if else{}
   * 的关系弄明白十分的复杂 干脆直接使用 深度来保存这些节点 通过深度来维护栈的关系
   */
  if (ischildrenElement) {
    let value = getFileOrDirName(targetElement) // 获得目录或者是文件名
    /*目录*/
    if (isdir(value)) {
      /*元素深度*/
      deptch.push({ value, depath: dirlength })
      /*元素*/
      stack.push(value)
      // console.log('depath: ', deptch)
      /*查找深度重复*/
      depathforEach()

      /*开始记录数据*/
      addElementNode(value, ops.Dir, dirlength, ops)
    } else {
      /*文件*/
      addElementNode(value, ops.File, dirlength, ops)
      // 最后一个文件弹出上一级目录
      if (hasLastElement(targetElement, ops)) {
        // TODO 可有可无的存在 暂时加上, 算了还是不加上了 可能会弹出最关键节点
        // stack.pop()
        // deptch.pop()
      }
    }
  } else if (isgrandElement) {
    /*循环 */
    child(target, ops)
  }
  return void 666
}

function addElementNode(value, stats, dirlength, ops) {
  let length = ops.depth
  // ----------------------test-------------------------
  let i = 1
  function feare(dirlength, node, i, length) {
    try {
      if (dirlength > Number(length)) {
        return
      }
    } catch (err) {
      throw Error(" depth Parameter error should be Number!!!")
    }
    let w
    if (dirlength == 0) {
      return node.addChild(value, stats)
    }
    w = node.children.get(stack[i])
    return feare(--dirlength, w, ++i)
  }
  feare(dirlength, stack[0], i, length)
  // -----------------------------------------------------
}


// 如果里面出现了相同的深度就说明 文件又到了另一个区域需要重新划分区域
function depathforEach() {
  // 长度多于2 才有意义
  if (deptch.length >= 2) {
    let lastElement = deptch[deptch.length - 1]
    let length = deptch.length

    for (let i = deptch.length - 2; i >= 0; i--) {
      // 深度相同说明文件是同级的需要判断
      if (lastElement.depath == deptch[i].depath) {
        // starck 每次只存储当前的层级目录 
        stack = stack.filter((arr, j) => arr != deptch[i].value)
        // todo ------------这里可以精简一下
        console.log('deptch: ', deptch)
        console.log('starck: ', stack)
        // 删除数组，从 i 开始往后全部删除
        deptch.splice(i, deptch.length - 1)
        // 如果 depath 的长度大于二 便可以替换 目的就是确保最后一个值必须是当前目录
        if (length > 2) {
          deptch.push(lastElement)
        }
        // ------------------------ end 
        /**  *
         * deptch.splice(i, 1)
         */
        // 如果 stack 的长度 大于了 deptch 说明 前面存在同级目录，但 deptch 被修改了 导致和 stack 数量的不一致
        // 这个时候去修改一下 starck 就行
        if (stack.length > deptch.length + 1) {
          console.log('111111111111')
          let length = deptch.length
          // 主要使 stack 和 deptch 数组保持一致性
          stack = stack.filter((arr, j) => j < length)
          stack.push(lastElement.value)
        }
      }
    }
  }
  // console.log('stack: ', stack)
  
  // console.log('deptch ', deptch )
}

/** 
 * 
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
 * 
 * **/
const str = `
├── public # 存放html模板
├── src
│ ├── assets # 存放会被 Webpack 处理的静态资源文件：一般是自己写的 js、css 或者图片等静态资源
│ ├── fonts # iconfont 目录
│ ├── images # 图片资源目录
│ ├── css # 全局样式目录
│ │  ├── common.scss # 全局通用样式目录
│ │  ├── core.scss # 全局sass 变量目录,直接使用，不需要引用，全局已统一引入。
│ └── init.scss # 全局初始化css
│ ├── common # 存放项目通用文件
│ ├── components # 项目中通用的业务组件目录
│ ├── config # 项目配置文件
│ ├── pages # 项目页面目录
│ ├── types # 项目中声明文件
`
const resolve = main(str)
// console.log(resolve)