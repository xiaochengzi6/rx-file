const path = require("path");
const fs = require("fs");
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
} = require("./utils.js");

var stack = []; // 记录目录
var deptch = []; // 记录深度

module.exports = main

function main(stringArrs, default_option) {
  let default_must = {
    nullFlie: "NULLFILE",
    Dir: "DIR",
    File: "FILE",
    depth: 5,
    pathSeparator: "/",
    throughTee: "├──",
    endTee: "└──",
    vertical: "│",
  };
  if (typeof default_option === null || typeof default_option === undefined) {
    default_option = default_must;
  } else {
    // 浅拷贝
    default_option = Object.assign({}, default_must, default_option);
  }
  if (!typeof stringArrs == "string") {
    throw Error("Parameter must specify the form of a string");
  }
  stringArrs = stringArrs.trim();
  let target;

  if (isFile(stringArrs, default_option)) {
    try {
      stringArrs = readfile(stringArrs);
    } catch (err) {
      throw Error("Wrong file path");
    }
  }
  target = Stringslice(stringArrs);

  // 获得 父节点
  const nodeRoot = root(target, default_option);
  stack.push(nodeRoot);
  forEachTarget(target, default_option);

  return stack;
};

function addElementNode(value, stats, dirlength, default_option) {
  let length = default_option.depth;
  // ----------------------test-------------------------
  let i = 1;
  function feare(dirlength, node, i, length) {
    try {
      if (dirlength > Number(length)) {
        return;
      }
    } catch (err) {
      throw Error(" depth Parameter error should be Number!!!");
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
  // -----------------------------------------------------
}

// 遍历
function forEachTarget(targets, default_option) {
  // let index = stack.length - 1;
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    /*进行微小处理：# 或"//" 都会被忽略。并且每行的空字符串将会被忽视*/
    target = elementSplit(target);

    // 主遍历
    child(target, default_option);
  }
}
// 如果里面出现了相同的深度就说明 文件又到了另外的深度需要重新划分区域
function depathforEach() {
  if (deptch.length >= 2) {
    let lastElement = deptch[deptch.length - 1];
    let length = deptch.length;
    for (let i = deptch.length - 2; i >= 0; i--) {
      if (lastElement.depath == deptch[i].depath) {
        stack = stack.filter((arr, j) => arr != deptch[i].value);
        let last = deptch[i];
        deptch.splice(i, deptch.length - 1);
        // 如果 depath 的长度大于二 便可以替换 目的就是确保最后一个值必须是当前目录
        if (length > 2) {
          deptch.push(lastElement);
        }
        // 如果 stack 的长度 大于了 deptch 说明 目录深度变小需要弹出多余目录
        if (stack.length > deptch.length + 1) {
          let length = deptch.length;
          // 主要使 stack 和 deptch 数组保持一致性
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
/*---------------------------------child---------------------------------*/
function child(target, default_option) {
  if (!!target == false) {
    return void 666;
  }
  let [targetElement, dirlength] = returnDepth(target, default_option);
  let ischildrenElement = hasList(targetElement, default_option); /*子节点*/
  /*孙节点*/
  let isgrandElement = ischildrenElement
    ? false
    : hasgrandElement(target, default_option);

  /**
   * todo 问题 --> 解决
   * 有点混乱了 这里应该要通过文件的深度或者是目录的深度来保存
   * 简直不可能，要判断很多 比如 是一个目录 但不是最后一个目录 是上一层次的目录 这种关系几乎要通过 if else{}
   * 的关系弄明白十分的复杂 干脆直接使用 深度来保存这些节点 通过深度来维护栈的关系
   */
  if (ischildrenElement) {
    let value = getFileOrDirName(targetElement); // 获得目录或者是文件名
    /*目录*/
    if (isdir(value)) {
      /*元素深度*/
      deptch.push({ value, depath: dirlength });
      /*元素*/
      stack.push(value);

      /*查找深度重复*/
      depathforEach();

      /*开始记录数据*/
      addElementNode(value, default_option.Dir, dirlength, default_option);
    } else {
      /*文件*/
      addElementNode(value, default_option.File, dirlength, default_option);
      // 最后一个文件弹出上一级目录
      if (hasLastElement(targetElement, default_option)) {
        // TODO 可有可无的存在 暂时加上, 算了还是不加上了 可能会弹出最关键节点
        // stack.pop();
        // deptch.pop()
      }
    }
  } else if (isgrandElement) {
    /*循环 */
    child(target, default_option);
  }
  return void 666;
}
