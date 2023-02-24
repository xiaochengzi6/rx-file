const path = require('path')
const fs = require('fs')

// 默认配置
const defaultOptions = {
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

const rootRegText = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/
const isDirRegText = /\.[a-z]+/
const getFileNameRegText = /[a-zA-Z].+/
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

// 找出根节点
function getNodeRoot(targetArrs, ops) {
  let rootNode, value
  targetArrs.forEach((element, index) => {
    element.search(rootRegText) !== -1 ? (value = rootRegText.exec(element)) : ""
  })
  if (!value) {
    // 处理到了根文件
    rootNode = new Node(ops.RootFlie, ops.Dir)
  } else {
    rootNode = new Node(value[0], ops.Dir)
    targetArrs.shift()
  }
  return rootNode
}

function getRegContent(reg, element) {
  const test = new RegExp(reg)
  try {
    return element.search(test) !== -1 ? true : false
  } catch (err) {
    throw Error(`You should reset the defaults ${reg}`)
  }
}

// 返回孙节点的节点
function returnDepth(element, ops) {
  let dirname = element.split(`${ops.vertical}`)
  const dirlength = dirname.length - 1
  dirname = dirname[dirlength].trim()
  // 返回孙节点的目录名和所在的深度
  return [dirname, dirlength]
}

// 是否是文件
function isFile(str, ops) {
  const Childtest = new RegExp(`${ops.endTee}`)
  return (
    str.search(/\//) !== -1 &&
    path.basename(str) != str &&
    str.search(Childtest) == -1
  )
}

function elementSplit(element) {
  if (element == null) return
  const string = element.trim()
  return string.split(/([#][^#]+)$/)[0]
}

// 读取文件
function readfile(element) {
  const data = fs.readFileSync(element)
  return data.toString().trim()
}

module.exports = {
  Node,
  getNodeRoot,
  returnDepth,
  isFile,
  elementSplit,
  readfile,
  hasDir: (element) => {
    return element.search(isDirRegText)
  },
  getFileOrDirName: (element) => {
    return getFileNameRegText.exec(element)[0]
  },
  hasChildFile: (element, ops) => {
    const childFileRegText = `^(${ops.throughTee}|${ops.endTee})`
    return getRegContent(childFileRegText, element)
  },
  hasLastElement: (element, ops) => {
    const lastFileRegText = `${ops.endTee}`
    return getRegContent(lastFileRegText, element)
  },
  hasgrandElement: (element, ops) => {
    const deepNodeRegText = `^${ops.vertical.trim()}`
    return getRegContent(deepNodeRegText, element)
  },
  defaultOptions
}
