const path = require("path")
let strs = []

module.exports = main

function main(node, ops) {
  if (Array.isArray(node) && node[0]) {
    node = node[0]
  }
  if((typeof node == null || typeof node == undefined ) || !node.value){
    throw Error('treePath Parameter error')
  }

  const arr = []
  if (node.children) {
    // 这里做出判断 根节点或许不是用户想要的 应该删除 或者 替换成用户想要的文件名
    if(ops && ops.inheritRootfile){
      arr.push(node.value)
    }
    arr.push('')
    forMap(node.children, arr)

    if (strs) { return strs }
  } else {
    return null
  }
}

function forMap(map, arr) {
  map.forEach((element) => {
    if (element.stats == "DIR") {
      // todo 注意这里 以后还可能做出过滤文件
      arr.push(element.value)
      if (element.children.size == 0) {
        /*最后一个目录 层级就会再返回上一层*/
        addString("", arr)
        arr.pop()
      } else {
        forMap(element.children, arr)
      }
    } else {
      /*遇到文件进行字符串的叠加*/
      addString(element.value, arr, strs)
    }
  })
  arr.pop()
}

function addString(element, arr) {
  let str = ""
  let lenght = arr.length
  if (lenght) {
    for (let i = 0; i < lenght; i++) {
      str = str + arr[i] + path.sep
    }
    str = str + element
    strs.push(str)
  }
}