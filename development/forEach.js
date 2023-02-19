const path = require("path");
// 选出默认配置
const {default_must}  = require('./utils')
let strs = [];

function main(node, default_options) {
  if (Array.isArray(node) && node[0]) {
    node = node[0]
  }
  if((typeof node == null || typeof node == undefined ) || !node.value){
    throw Error('treePath Parameter error')
  }
  // 处理参数
  if(!default_options){
    default_options = default_must
  }
  const arr = [];
  if (node.children) {
    // 这里做出判断 根节点或许不是用户想要的 应该删除 或者 替换成用户想要的文件名
    if(default_options && default_options.inheritRootfile){
      // 默认 inheritRootfile = false
      arr.push(node.value);
    }
    arr.push('');
    forMap(node.children, arr, default_options);
    if (strs) {
      return strs;
    }
  } else {
    return null;
  }
}
module.exports = main;

function addString(element, arr) {
  let str = "";
  let lenght = arr.length;
  if (lenght) {
    for (let i = 0; i < lenght; i++) {
      str = str + arr[i] + path.sep;
    }
    str = str + element;
    strs.push(str);
  }
}

function forMap(map, arr) {
  map.forEach((element) => {
    if (element.stats == "DIR") {
      // todo 注意这里 以后还可能做出过滤文件
      arr.push(element.value);
      if (element.children.size == 0) {
        // console.log('element.value', element)
        /*创建空目录*/
        addString("", arr);
        arr.pop();
      } else {
        forMap(element.children, arr);
      }
    } else {
      /*进行字符串的叠加*/
      addString(element.value, arr, strs);
    }
  });
  arr.pop();
}
