// 基于深度优先的遍历方式

// const target = `
// home
// ├── user
// |  ├── foo.js
// |  ├── test
// |  |  ├── bar.js
// |  |  └── baz.js
// |  └── bat.js
// ├── ww/bat.js
// ├── zz/bat.js
// └── uu
//    ├── a.js
//    ├── b.js
//    └── yy/rd/a.js
// `.trim();
const target =`
home
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`.trim();

const DEFAULT_OPTIONS = {
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

// 1.0先切分成一个一个的（行切分每一行都会切分成一个元素保存在数组中）
// 1.先找到根节点并记录为 0
// 2.1、找一级目录或者文件
// 2.1.1、如果查找到是文件就直接保存在 根节点中
// 3.2、如果是目录要遍历并且记录下当前的节点作为 “根” 来保存文件 这里实现一个遍历
// 4.1 保存目录直接的关系先记录当前的根目录，然后将其记录为 1
// 4.1.1 如果找到的是目录就要保存信息为 2
// 4.1.1.1 如果其下有文件就要通过 2 来存储在 2 下
// 4.1.1.2 没有文件不用保存节点信息，直接来进行下一步
// 4.2 如果是文件就要保存存在 1
// 4.2.1 没有文件那么就会退出 并弹出 1
// 4.3 还有目录就要再 进行 4.1.1 - 4.1.1.2 的变化。
// 4.4 没有文件要保存就会弹出 根文件
// 4.5 结束

// 1.0
function Stringslice(target) {
  const targetArrs = target.split("\n");
  return targetArrs;
}

// 2.0 找出根节点
function root(targetArrs) {
  let text = /^[a-zA-Z]+/;
  let rootNode, value;
  targetArrs.forEach((element, index) => {
    element.search(text) !== -1 ? (value = text.exec(element)) : "";
  });
  if (!value) {
    rootNode = new Node(DEFAULT_OPTIONS.nullFlie, DEFAULT_OPTIONS.Dir);
  } else {
    rootNode = new Node(value[0], DEFAULT_OPTIONS.Dir);
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
function matchElement(element) {
  const Childtest = /^(├──|└──)/;
  let boolean = element.search(Childtest) !== -1 ? true : false;
  return boolean;
}

// 是否是最后一个文件
function lastfile(element) {
  const Childtest = /└──/;
  let boolean;
  if (!isdir(element)) {
    boolean = element.search(Childtest) !== -1 ? true : false;
  }
  return boolean;
}

// 是否孙节点 '|  |  |  └──filename/.js'
function isgrandson(element) {
  const test = /^|/;
  let value = element.search(test) !== -1 ? true : false;
  return value;
}

// 返回孙节点的节点
function returnDepth(element) {
  let value = element.split("|");
  let length = value.length - 1;
  value = value[length].trim();
  return value;
}

// 递归查询
function depthSearch(stack, value, stats) {
  let length = stack.length;
  let node;
  if (length == 1) {
    node = stack[0].addChild(value, stats);
  } else if (length == 2) {
    node = stack[0].children.get(stack[1]).addChild(value, stats);
  }else if (length == 3){
    node = stack[0].children.get(stack[1]).children.get(stack[2]).addChild(value, stats)
  }
  return node
}

// 遍历
function forEachTarget(targets, stack) {
  let index = stack.length - 1;
  for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    child(target, index, stack);
  }
  return stack;
}

function child(target, index, stack) {
  let j = stack.length - 1;
  if (matchElement(target)) {
    // 子目录或者是子文件
    let value = searName(target);

    // 子 是目录就会保存当前的栈
    if (isdir(value)) {
      // Map(1) {
      //   'home' => Node { value: 'home', stats: 'DIR', children: Map(0) {} }
      // }
      depthSearch(stack, value, DEFAULT_OPTIONS.Dir)

      stack.push(value);
      j = stack.length - 1;
      // 子 是文件
    } else {
      depthSearch(stack, value, DEFAULT_OPTIONS.File)
      // 最后一个是文件不是目录弹出当前的栈
      if (lastfile(target)) {
        if (stack.length > 1) {
          stack.pop();
          j = stack.length - 1;
        }
      }
    }
    // 孙
  } else if (isgrandson(target)) {
    let value = returnDepth(target);
    child(value, j, stack);
  }
}

function main(stringArrs) {
  let stack = [];

  const target = Stringslice(stringArrs);
  const nodeRoot = root(target);
  stack.push(nodeRoot);

  // 查找文件
  let node = forEachTarget(target, stack);
  return node[0];
}


module.exports = main;
