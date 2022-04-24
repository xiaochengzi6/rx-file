const path = require("path");

let strs = [];
function main(node) {
  if (Array.isArray(node) && node[0]) {
    node = node[0]
  }
  if((typeof node == null || typeof node == undefined ) || !node.value){
    throw Error('treePath Parameter error')
  }
  const arr = [];
  if (node.children) {
    arr.push(node.value);
    forMap(node.children, arr);
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
