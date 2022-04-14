const path = require("path");
const fs = require("fs");

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
function searName(element) {
  const name = /[a-zA-Z].+/;
  let value = name.exec(element);
  return value[0];
}

// 分变子文件或者是目录
// default_option
function matchElement(element, default_option) {
  // const Childtest = /^(├──|└──)/;
  const Childtest = new RegExp(
    `^(${default_option.sequences.throughTee}|${default_option.sequences.endTee})`
  );
  let boolean = element.search(Childtest) !== -1 ? true : false;
  return boolean;
}

// 是否是最后一个文件
function lastfile(element, default_option) {
  // const Childtest = /└──/;
  const Childtest = new RegExp(`${default_option.sequences.endTee}`);
  let boolean;
  if (!isdir(element)) {
    boolean = element.search(Childtest) !== -1 ? true : false;
  }
  return boolean;
}

// 是否孙节点 '|  |  |  └──filename/.js'
function isgrandson(element, default_option) {
  // const test = /^|/;
  const test = new RegExp(`^${default_option.sequences.vertical.trim()}`);
  let value = element.search(test) !== -1 ? true : false;
  return value;
}

// 返回孙节点的节点
function returnDepth(element, default_option) {
  // let value = element.split("|");
  let value = element.split(`${default_option.sequences.vertical}`);
  let length = value.length - 1;
  value = value[length].trim();
  return value;
}
// 是否是文件
function isFile(str,default_option) {
  const Childtest = new RegExp(`${default_option.sequences.endTee}`);
  return  str.search(/\//) !== -1 && path.basename(str) != str && str.search(Childtest) == -1
  
}
// 读取文件
function readfile(element) {
  const data = fs.readFileSync(element);
  let value = data.toString().trim();
  return value
}

// 递归查询
function depthSearch(stack, value, stats) {
  let length = stack.length;
  let node;
  if (length == 1) {
    node = stack[0].addChild(value, stats);
  } else if (length == 2) {
    node = stack[0].children.get(stack[1]).addChild(value, stats);
  } else if (length == 3) {
    node = stack[0].children
      .get(stack[1])
      .children.get(stack[2])
      .addChild(value, stats);
  }
  return node;
}

// 遍历
function forEachTarget(targets, stack, default_option) {
  let index = stack.length - 1;
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    child(target, index, stack, default_option);
  }
  return stack;
}

function child(target, index, stack, default_option) {
  let j = stack.length - 1;
  if (matchElement(target, default_option)) {
    // 子目录或者是子文件
    let value = searName(target);

    if (isdir(value)) {
      /*清除空目录的保存的栈*/
      if(stack.length >= 2) {
        stack.pop();
      }
      /*目录*/
      depthSearch(stack, value, default_option.Dir);
      
      stack.push(value);
      j = stack.length - 1;
    } else {
      /*文件*/
      depthSearch(stack, value, default_option.File);
      /*最后一个文件也要弹出文件夹的栈*/
      if (lastfile(target, default_option)) {
        if (stack.length > 1) {
          stack.pop();
          j = stack.length - 1;
        }
      }
    }
  } else if (isgrandson(target, default_option)) {
    let value = returnDepth(target, default_option);
    child(value, j, stack, default_option);
  }
}

function main(stringArrs, default_option) {
  if (!typeof stringArrs == "string") {
    throw Error("stringArrs 必须指定字符串的形式");
  }
  stringArrs = stringArrs.trim();
  let stack = [], target
  
  if( isFile(stringArrs, default_option) ){
    try{
      stringArrs = readfile(stringArrs)
    }catch(err) {
      console.log('文件错误')
    }
  }
  target = Stringslice(stringArrs);

  const nodeRoot = root(target, default_option);
  stack.push(nodeRoot);

  let node = forEachTarget(target, stack, default_option);
  return node[0];
}

module.exports = main;

const str = `
home
├── foo
├── fo1
|  ├── bar.js
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
  pathSeparator: "/",
  sequences: {
    throughTee: "├──",
    endTee: "└──",
    vertical: "|  ",
    emptyColumn: "   ",
  },
};
let a = main(str, DEFAULT_OPTIONS)
console.log(a)

const forEachMap = require("../lib/forEach");
let b = forEachMap(a)
console.log(b)