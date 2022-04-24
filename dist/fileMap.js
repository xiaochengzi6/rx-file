'use strict';

require("path");
require("fs");
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
  hasgrandElement
} = require('./utils.js');
console.log(isFile);
var stack = [];
var deptch = [];
exports.main = function main(stringArrs, default_option) {
  if (!typeof stringArrs == "string") {
    throw Error("stringArrs 必须指定字符串的形式");
  }
  stringArrs = stringArrs.trim();
  let target;
  if (isFile(stringArrs, default_option)) {
    try {
      stringArrs = readfile(stringArrs);
    } catch (err) {
      console.log("文件错误");
    }
  }
  target = Stringslice(stringArrs);
  const nodeRoot = root(target, default_option);
  stack.push(nodeRoot);
  forEachTarget(target, default_option);
  return stack;
};
function addElementNode(value, stats, dirlength, default_option) {
  let length = default_option.depth;
  let i = 1;
  function feare(dirlength, node, i, length) {
    try {
      if (dirlength > Number(length)) {
        return;
      }
    } catch (err) {
      console.log("depth 参数错误");
    }
    let w;
    if (dirlength == 0) {
      w = node.addChild(value, stats);
      return;
    }
    w = node.children.get(stack[i]);
    return feare(--dirlength, w, ++i);
  }
  feare(dirlength, stack[0], i, length);
}
function forEachTarget(targets, default_option) {
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    target = elementSplit(target);
    child(target, default_option);
  }
}
function depathforEach() {
  if (deptch.length >= 2) {
    let lastElement = deptch[deptch.length - 1];
    let length = deptch.length;
    for (let i = deptch.length - 2; i >= 0; i--) {
      if (lastElement.depath == deptch[i].depath) {
        stack = stack.filter((arr, j) => arr != deptch[i].value);
        deptch.splice(i, deptch.length - 1);
        if (length > 2) {
          deptch.push(lastElement);
        }
        if (stack.length > deptch.length + 1) {
          let length = deptch.length;
          stack = stack.filter((arr, j) => j <= length);
          stack.pop();
          stack.push(lastElement.value);
        }
        return void 666;
      }
    }
  }
  return void 666;
}
function child(target, default_option) {
  if (!!target == false) {
    return void 666;
  }
  let [targetElement, dirlength] = returnDepth(target, default_option);
  let ischildrenElement = hasList(targetElement, default_option);
  let isgrandElement = ischildrenElement
    ? false
    : hasgrandElement(target, default_option);
  if (ischildrenElement) {
    let value = getFileOrDirName(targetElement);
    if (isdir(value)) {
      deptch.push({ value, depath: dirlength });
      stack.push(value);
      depathforEach();
      addElementNode(value, default_option.Dir, dirlength, default_option);
    } else {
      addElementNode(value, default_option.File, dirlength, default_option);
      if (hasLastElement(targetElement, default_option)) ;
    }
  } else if (isgrandElement) {
    child(target, default_option);
  }
  return void 666;
}
