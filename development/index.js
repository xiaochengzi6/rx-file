const fs = require('fs')
const path = require("path")
const createFile = require("./development/createfile")

export const defaultOptions = {
  RootFlie: "NULLFILE",
  inheritRootfile: false,
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "│",
}

var stack = []            // 记录目录
var deptch = []           // 记录深度
var fileNamePaths = []    // 存储文件路径

const rootRegText = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/   // 匹配根文件名
const isDirRegText = /\.[a-z]+/                        // 是否是目录
const getFileNameRegText = /[a-zA-Z].+/                // 匹配文件名

// 记录文件之间的关系
class Node {
  constructor(value, stats) {
    this.value = value
    this.stats = stats
    this.children = new Map()
  }

  addChild(value, stats) {
    if (!this.children.has(value)) {
      const newNode = new Node(value, stats)
      this.children.set(value, newNode)
      return newNode
    }
    return this.children.get(value)
  }
}

// 主函数
function treeToFilePath(str, ops = defaultOptions) {
  if (!typeof str == "string") {
    throw Error("Parameter must specify the form of a string")
  }

  ops = ops ? defaultOptions : Object.assign({}, defaultOptions, ops)
  str = str.trim()
  // 读取文件
  if (isFile(str, ops)) {
    str = readfile(str)
  }
  const target = str.split('\n')
  const nodegetNodeRoot = getNodeRoot(target, ops)
  stack.push(nodegetNodeRoot)
  forEachTarget(target, ops)

  const filePath = generaterFilePath(stack[0], ops)

  return {
    fileMap: stack[0],
    filePath,
    generateFile: (root, ops) => {
      return createFile(root, filePath, ops)
    },
  }
}

export default treeToFilePath
// ===============================================================================
// ==                                处理图形                                   ==
// ===============================================================================

// 遍历并格式化处理树状图结构
const forEachTarget = (targets, ops) => {
  for (let i = -1; i < targets.length; i++) {
    let target = targets[i]
    // # 或"//" 都会被忽略。并且每行的空字符串将会被忽视
    target = fileNameSplit(target)

    disposeElement(target, ops)
  }
}

const disposeElement = (target, ops) => {
  if (target == null) { return void 0 }
  // 每个文件/目录名 and 所在深度
  const [targetElement, dirlength] = returnDepth(target, ops)
  const ischildrenElement = hasChildFile(targetElement, ops)

  // 判断是否是孙文件(更深层次的文件)
  let isgrandElement = ischildrenElement
    ? false
    : hasgrandElement(target, ops)

  if (ischildrenElement) {
    // 获得目录或者是文件名
    let value = getFileOrDirName(targetElement) // 获得目录或者是文件名

    if (hasDir(value)) {
      deptch.push({ value, depath: dirlength })
      stack.push(value)

      // 处理文件层级
      depathforEach()

      addElementNode(value, ops.Dir, dirlength, ops)
    } else {
      addElementNode(value, ops.File, dirlength, ops)
    }
  } else if (isgrandElement) {
    disposeElement(target, ops)
  }
}

// 组成 Map 数据结构: 确保文件层级
const addElementNode = (value, stats, dirlength, ops) => {
  const length = ops.depth
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
    return feare(--dirlength, w, ++i, length)
  }
  feare(dirlength, stack[0], i, length)
}

// 根据文件的不同深度 --> 归并
const depathforEach = () => {
  if (deptch.length < 2) return

  let lastElement = deptch[deptch.length - 1]
  let length = deptch.length

  for (let i = deptch.length - 2; i >= 0; i--) {
    if (lastElement.depath == deptch[i].depath) {
      // starck 需要排除层级相同的元素
      stack = stack.filter(arr => arr != deptch[i].value)

      // deptch 清理： 深度相同的元素
      deptch.splice(i, 1)
      deptch.splice(i, deptch.length - 1)
      if (length > 2) {
        deptch.push(lastElement)
      }
      // stack 清理：的长度大于 deptch 说明 stack 需要清理(存在深度相同的元素)
      if (stack.length > deptch.length + 1) {
        let length = deptch.length
        stack = stack.filter((_, j) => j < length)
        stack.push(lastElement.value)
      }
    }
  }
}

// ===============================================================================
// ==                             生成文件路径                                   ==
// ===============================================================================

const generaterFilePath = (node, ops) => {
  if (node == null && !node.children) return
  const fileNameArr = []
  ops.inheritRootfile && fileNameArr.push(node.value)

  forEachFileMap(node.children, fileNameArr)
}

// 遍历 map 结构
const forEachFileMap = (map, arr) => {
  map.forEach((element) => {
    if (element.stats == "DIR") {
      arr.push(element.value)

      if (element.children.size == 0) {
        addString("", arr)
        arr.pop()
      } else {
        forEachFileMap(element.children, arr)
      }
    } else {
      addString(element.value, arr, fileNamePaths)
    }
  })

  arr.pop()
}

// 组装 file name
const addString = (element, arr) => {
  let str = ""
  const lenght = arr.length
  if (!length) return

  for (let i = 0; i < lenght; i++) {
    str = str + arr[i] + path.sep
  }

  str += element
  fileNamePaths.push(str)
}

// ===============================================================================
// ==                                   utils                                   ==
// ===============================================================================

// 找出根节点
const getNodeRoot = (targetArrs, ops) => {
  const value = targetArrs.find(ele => ele.search(rootRegText))

  if (value) {
    return new Node(value, ops.Dir)
  }

  targetArrs.shift()
  return new Node(ops.RootFlie, ops.Dir)
}

const getRegContent = (reg, element)=> {
  const test = new RegExp(reg)
  return !!element.search(test)
}

// 返回孙节点的节点
const returnDepth = (element, ops) => {
  let dirname = element.split(`${ops.vertical}`)
  const dirlength = dirname.length - 1
  dirname = dirname[dirlength].trim()
  // 返回孙节点的目录名和所在的深度
  return [dirname, dirlength]
}

// 是否是文件
const isFile = (str, ops) => {
  const Childtest = new RegExp(`${ops.endTee}`)
  return (
    str.search(/\//) !== -1 &&
    path.basename(str) != str &&
    str.search(Childtest) == -1
  )
}

const fileNameSplit = (element) => {
  if (element == null) return
  const string = element.trim()
  return string.split(/([#][^#]+)$/)[0]
}

// 读取文件
const readfile = (element) => {
  const data = fs.readFileSync(element)
  return data.toString().trim()
}

// 是否是目录
const hasDir = element => {
  return element.search(isDirRegText)
}

// 获取文件名
const getFileOrDirName = element => {
  return getFileNameRegText.exec(element)[0]
}

// 文件查找
const hasChildFile = (element, ops) => {
  return getRegContent(`^(${ops.throughTee}|${ops.endTee})`, element)
}

const hasLastElement = (element, ops) => {
  return getRegContent(`${ops.endTee}`, element)
}

const hasgrandElement = (element, ops) => {
  return getRegContent(`^${ops.vertical.trim()}`, element)
}
