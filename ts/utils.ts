const path =  require('path')
const fs = require('fs')

export interface defaultOptionsType {
  RootFlie: string,
  inheritRootfile: boolean,
  Dir: "DIR",
  File: "FILE",
  depth: number,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "│",
}

// 默认配置
export const defaultOptions: defaultOptionsType = {
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
const getFileNameRegText: RegExp | null = /[a-zA-Z].+/


export class node {
  value: string
  stats: string
  children: Map<string, any>

  constructor(value: string, stats: string) {
    this.value = value
    this.stats = stats
    this.children = new Map()
  }

  addChild(value: string, stats: string) {
    if (!this.children.has(value)) {
      const newNode = new node(value, stats)
      this.children.set(value, newNode)
      return newNode
    }
    return this.children.get(value)
  }
}

export function getNodeRoot(targetArr: string[], ops: defaultOptionsType) {
  let rootNode: node, value: any[] | null = null
  targetArr.forEach(element => {
    element.search(rootRegText) !== -1 ? (value = rootRegText.exec(element)) : ''
  })
  if (!value) {
    // 处理到了根文件
    rootNode = new node(ops.RootFlie, ops.Dir)
  } else {
    rootNode = new node(value[0], ops.Dir)
    targetArr.shift()
  }
  return rootNode
}

export function getRegContent(reg: string, element: string) {
  const test = new RegExp(reg)
  try {
    return element.search(test) !== -1 ? true : false
  } catch (err) {
    throw Error(`You should reset the defaults ${reg}`)
  }
}

export function returnDepth(element: string, ops: defaultOptionsType): [string, number]{
  const dirnameArr = element.split(`${ops.vertical}`)
  const dirlength = dirnameArr.length - 1
  const dirname = dirnameArr[dirlength].trim()
  // 返回孙节点的目录名和所在的深度
  return [dirname, dirlength]
}

// 是否是文件
export function isFile(str: string, ops: defaultOptionsType) {
  const Childtest = new RegExp(`${ops.endTee}`)
  return (
    str.search(/\//) !== -1 &&
    path.basename(str) != str &&
    str.search(Childtest) == -1
  )
}

export function elementSplit(element: string) {
  if (element == null) return
  const string = element.trim()
  return string.split(/([#][^#]+)$/)[0]
}

// 读取文件
export function readfile(element) {
  const data = fs.readFileSync(element)
  return data.toString().trim()
}

export function hasDir(element) {
  return element.search(isDirRegText)
}

export function getFileOrDirName(element) {
  return getFileNameRegText?.exec(element)![0]
}

export function hasChildFile(element, ops) {
  const childFileRegText = `^(${ops.throughTee}|${ops.endTee})`
  return getRegContent(childFileRegText, element)
}

export function hasLastElement(element, ops) {
  const lastFileRegText = `${ops.endTee}`
  return getRegContent(lastFileRegText, element)
}

export function hasgrandElement(element, ops) {
  const deepNodeRegText = `^${ops.vertical.trim()}`
  return getRegContent(deepNodeRegText, element)
}
