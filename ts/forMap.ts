import {
  getNodeRoot,
  hasDir,
  getFileOrDirName,
  hasChildFile,
  hasLastElement,
  returnDepth,
  isFile,
  elementSplit,
  readfile,
  hasgrandElement,
  defaultOptionsType
} from "./utils"

let stack: any[] = []
let deptch: any[] = []


export function main(str: string, ops: defaultOptionsType) {
  str = str.trim()
  if (isFile(str, ops)) {
    str = readfile(str)
  }

  const target = str.split('\n')
  const nodeRoot = getNodeRoot(target, ops)
  stack.push(nodeRoot)
  forEachTarget(target, ops)

  return stack[0]
}

function forEachTarget(elements: string[], ops: defaultOptionsType) {
  for (let i = -1; i < elements.length; i++) {
    const element = elementSplit(elements[i]) || ''
    // 主遍历
    disposeElement(element, ops)
  }
}

function disposeElement(ele: string, ops: defaultOptionsType) {
  if (ele == null) { return void 0 }
  const [targetElement, dirlength] = returnDepth(ele, ops)
  const ischildrenElement = hasChildFile(targetElement, ops)
  const isgrandElement = ischildrenElement
    ? false
    : hasgrandElement(ele, ops)

  if (ischildrenElement) {
    const value = getFileOrDirName(targetElement) || '' // 获得目录或者是文件名
    /*目录*/
    if (hasDir(value)) {
      /*元素深度*/
      deptch.push({ value, depath: dirlength })
      /*元素*/
      stack.push(value)
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
    disposeElement(ele, ops)
  }
}

function addElementNode(value: string, stats: string, dirlength: number, ops) {
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
        deptch.splice(i, 1)
        // 删除数组，从 i 开始往后全部删除
        deptch.splice(i, deptch.length - 1)
        // 如果 depath 的长度大于二 便可以替换 目的就是确保最后一个值必须是当前目录
        if (length > 2) {
          deptch.push(lastElement)
        }
        // 如果 stack 的长度 大于了 deptch 说明 前面存在同级目录，但 deptch 被修改了 导致和 stack 数量的不一致
        // 这个时候去修改一下 starck 就行
        if (stack.length > deptch.length + 1) {
          let length = deptch.length
          // 主要使 stack 和 deptch 数组保持一致性
          stack = stack.filter((_, j) => j < length)
          stack.push(lastElement.value)
        }
      }
    }
  }
}





















