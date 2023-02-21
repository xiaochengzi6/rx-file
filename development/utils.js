const path = require('path')
const fs = require('fs')

// 默认配置
const default_must = {
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

function Stringslice(target) {
  return target.split("\n")
}
// 2.0 找出根节点
function root(targetArrs, ops) {
  // let text = /^[a-zA-Z]+\//
  let text = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/
  let rootNode, value
  targetArrs.forEach((element, index) => {
    element.search(text) !== -1 ? (value = text.exec(element)) : ""
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

// 判断是否是目录 不是目录就会返回 false
function isdir(element) {
  const elementTest = /\.[a-z]+/
  let boolean = element.search(elementTest) == -1 ? true : false
  return boolean
}

// 提取文件或者目录名
function getFileOrDirName(element) {
  const name = /[a-zA-Z].+/
  let value = name.exec(element)
  return value[0]
}

// 判断是否是同一级文件 {找到：true 未找到：false}
function hasList(element, ops) {
  // const Childtest = /^(├──|└──)/
  const Childtest = new RegExp(
    `^(${ops.throughTee}|${ops.endTee})`
  )
  try{
    return element.search(Childtest) !== -1 ? true : false
  }catch(err){
    throw Error("You should reset the defaults opsS.endTee || opsS.throughTee")
  }
}

// 是否是最后一个文件
function hasLastElement(element, ops) {
  // const Childtest = /└──/
  const Childtest = new RegExp(`${ops.endTee}`)
  try{
    let boolean = element.search(Childtest) !== -1 ? true : false
    return boolean
  }catch(err){
    throw Error("You should reset the defaults opsS.endTee")
  }
}

// 是否孙节点 '|  |  |  └──filename/.js'
function hasgrandElement(element, ops) {
  // const test = /^|/
  const test = new RegExp(`^${ops.vertical.trim()}`)
  try{
    return element.search(test) !== -1 ? true : false
  }catch(err){
    throw Error("You should reset the defaults opsS.vertical")
  }
}

// 返回孙节点的节点
function returnDepth(element, ops) {
  // ops.sequences.vertical: "|"
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
  if(element == null) return 
  // console.log(element)
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
  default_must
}
