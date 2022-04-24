const path = require("path");
const fs = require("fs");

var stack = []; // 记录目录
var deptch = []; // 记录深度

class Node {
  constructor(value, stats) {
    this.value = value;
    this.stats = stats;
    this.children = new Map();
  }

  addChild(value, stats) {
    if (!this.children.has(value)) {
      const newNode = new Node(value, stats);
      this.children.set(value, newNode);
      return newNode;
    }
    return this.children.get(value);
  }
}

// 1.0
function Stringslice(target) {
  const targetArrs = target.split("\n");
  return targetArrs;
}

// 2.0 找出根节点
function root(targetArrs, default_option) {
  // let text = /^[a-zA-Z]+\//;
  let text = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/;
  let rootNode, value;
  targetArrs.forEach((element, index) => {
    element.search(text) !== -1 ? (value = text.exec(element)) : "";
  });
  if (!value) {
    rootNode = new Node(default_option.nullFlie, default_option.Dir);
  } else {
    rootNode = new Node(value[0], default_option.Dir);
    targetArrs.shift();
  }
  return rootNode;
}

// 判断是否是目录 不是目录就会返回 false
function isdir(element) {
  const elementTest = /\.[a-z]+/;
  let boolean = element.search(elementTest) == -1 ? true : false;
  return boolean;
}

// 提取文件或者目录名
function getFileOrDirName(element) {
  const name = /[a-zA-Z].+/;
  let value = name.exec(element);
  return value[0];
}

// 分辨文件或者是目录　hasList
function hasList(element, default_option) {
  // const Childtest = /^(├──|└──)/;
  const Childtest = new RegExp(
    `^(${default_option.sequences.throughTee}|${default_option.sequences.endTee})`
  );
  let boolean = element.search(Childtest) !== -1 ? true : false;
  return boolean;
}

// 是否是最后一个文件
function hasLastElement(element, default_option) {
  // const Childtest = /└──/;
  const Childtest = new RegExp(`${default_option.sequences.endTee}`);
  let boolean = element.search(Childtest) !== -1 ? true : false;
  return boolean;
}

// 是否孙节点 '|  |  |  └──filename/.js'
function hasgrandElement(element, default_option) {
  // const test = /^|/;
  const test = new RegExp(`^${default_option.sequences.vertical.trim()}`);
  let value = element.search(test) !== -1 ? true : false;
  return value;
}

// 返回孙节点的节点
function returnDepth(element, default_option) {
  // default_option.sequences.vertical: "|"
  let dirname = element.split(`${default_option.sequences.vertical}`);
  let dirlength = dirname.length - 1;
  dirname = dirname[dirlength].trim();
  // 返回孙节点的目录名和所在的深度
  // console.log("dirname", dirname, "dirlength", dirlength);
  return [dirname, dirlength];
}
// 是否是文件
function isFile(str, default_option) {
  const Childtest = new RegExp(`${default_option.sequences.endTee}`);
  return (
    str.search(/\//) !== -1 &&
    path.basename(str) != str &&
    str.search(Childtest) == -1
  );
}
// 读取文件
function readfile(element) {
  const data = fs.readFileSync(element);
  let value = data.toString().trim();
  return value;
}

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
  // -----------------------------------------------------
}
function elementSplit(element) {
  let string = element.trim();
  let b = string.split(/([#][^#]+)$/)[0];
  return b;
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
    let Element = lastElement;
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
        // TODO 可有可无的存在 暂时加上
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
//---------------------------------------------------------------------------

function main(stringArrs, default_option) {
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

  // 获得 父节点
  const nodeRoot = root(target, default_option);
  stack.push(nodeRoot);
  forEachTarget(target, default_option);
}

module.exports = main;

const str = `
home
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`.trim();
let uu = "./the.txt";

let DEFAULT_OPTIONS = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  sequences: {
    throughTee: "├──",
    endTee: "└──",
    vertical: "|",
    // vertical: "│",
    emptyColumn: "   ",
  },
};

var a = main(str, DEFAULT_OPTIONS);
console.log('stack', stack[0])
let arr = [];
arr.push(stack[0].value)
let strs = [];

forMap(stack[0].children, arr);

console.log("ssssss", strs);

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
        /*创建空目录*/
        addString("", arr);
        arr.pop();
      } else {
        forMap(element.children, arr);
      }
    } else {
      /*进行字符串的叠加*/
      addString(element.value, arr);
    }
  });
  arr.pop();
}
