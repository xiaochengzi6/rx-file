'use strict';

const fs = require('fs');

const path = require("path");

const createFile = require("./development/createfile");

const defaultOptions = {
  RootFlie: "NULLFILE",
  inheritRootfile: false,
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "│"
};
var stack = [];
var deptch = [];
var fileNamePaths = [];
const rootRegText = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/;
const isDirRegText = /\.[a-z]+/;
const getFileNameRegText = /[a-zA-Z].+/;

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

function treeToFilePath(str, ops = defaultOptions) {
  if (!typeof str == "string") {
    throw Error("Parameter must specify the form of a string");
  }

  ops = ops ? defaultOptions : Object.assign({}, defaultOptions, ops);
  str = str.trim();

  if (isFile(str, ops)) {
    str = readfile(str);
  }

  const target = str.split('\n');
  const nodegetNodeRoot = getNodeRoot(target, ops);
  stack.push(nodegetNodeRoot);
  forEachTarget(target, ops);
  const filePath = generaterFilePath(stack[0], ops);
  return {
    fileMap: stack[0],
    filePath,
    generateFile: (root, ops) => {
      return createFile(root, filePath, ops);
    }
  };
}

module.export = treeToFilePath;

const forEachTarget = (targets, ops) => {
  for (let i = -1; i < targets.length; i++) {
    let target = targets[i];
    target = fileNameSplit(target);
    disposeElement(target, ops);
  }
};

const disposeElement = (target, ops) => {
  if (target == null) {
    return void 0;
  }

  const [targetElement, dirlength] = returnDepth(target, ops);
  const ischildrenElement = hasChildFile(targetElement, ops);
  let isgrandElement = ischildrenElement ? false : hasgrandElement(target, ops);

  if (ischildrenElement) {
    let value = getFileOrDirName(targetElement);

    if (hasDir(value)) {
      deptch.push({
        value,
        depath: dirlength
      });
      stack.push(value);
      depathforEach();
      addElementNode(value, ops.Dir, dirlength, ops);
    } else {
      addElementNode(value, ops.File, dirlength, ops);
    }
  } else if (isgrandElement) {
    disposeElement(target, ops);
  }
};

const addElementNode = (value, stats, dirlength, ops) => {
  const length = ops.depth;
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
      return node.addChild(value, stats);
    }

    w = node.children.get(stack[i]);
    return feare(--dirlength, w, ++i, length);
  }

  feare(dirlength, stack[0], i, length);
};

const depathforEach = () => {
  if (deptch.length < 2) return;
  let lastElement = deptch[deptch.length - 1];
  let length = deptch.length;

  for (let i = deptch.length - 2; i >= 0; i--) {
    if (lastElement.depath == deptch[i].depath) {
      stack = stack.filter(arr => arr != deptch[i].value);
      deptch.splice(i, 1);
      deptch.splice(i, deptch.length - 1);

      if (length > 2) {
        deptch.push(lastElement);
      }

      if (stack.length > deptch.length + 1) {
        let length = deptch.length;
        stack = stack.filter((_, j) => j < length);
        stack.push(lastElement.value);
      }
    }
  }
};

const generaterFilePath = (node, ops) => {
  if (node == null && !node.children) return;
  const fileNameArr = [];
  ops.inheritRootfile && fileNameArr.push(node.value);
  forEachFileMap(node.children, fileNameArr);
};

const forEachFileMap = (map, arr) => {
  map.forEach(element => {
    if (element.stats == "DIR") {
      arr.push(element.value);

      if (element.children.size == 0) {
        addString("", arr);
        arr.pop();
      } else {
        forEachFileMap(element.children, arr);
      }
    } else {
      addString(element.value, arr);
    }
  });
  arr.pop();
};

const addString = (element, arr) => {
  let str = "";
  const lenght = arr.length;
  if (!length) return;

  for (let i = 0; i < lenght; i++) {
    str = str + arr[i] + path.sep;
  }

  str += element;
  fileNamePaths.push(str);
};

const getNodeRoot = (targetArrs, ops) => {
  const value = targetArrs.find(ele => ele.search(rootRegText));

  if (value) {
    return new Node(value, ops.Dir);
  }

  targetArrs.shift();
  return new Node(ops.RootFlie, ops.Dir);
};

const getRegContent = (reg, element) => {
  const test = new RegExp(reg);
  return !!element.search(test);
};

const returnDepth = (element, ops) => {
  let dirname = element.split(`${ops.vertical}`);
  const dirlength = dirname.length - 1;
  dirname = dirname[dirlength].trim();
  return [dirname, dirlength];
};

const isFile = (str, ops) => {
  const Childtest = new RegExp(`${ops.endTee}`);
  return str.search(/\//) !== -1 && path.basename(str) != str && str.search(Childtest) == -1;
};

const fileNameSplit = element => {
  if (element == null) return;
  const string = element.trim();
  return string.split(/([#][^#]+)$/)[0];
};

const readfile = element => {
  const data = fs.readFileSync(element);
  return data.toString().trim();
};

const hasDir = element => {
  return element.search(isDirRegText);
};

const getFileOrDirName = element => {
  return getFileNameRegText.exec(element)[0];
};

const hasChildFile = (element, ops) => {
  return getRegContent(`^(${ops.throughTee}|${ops.endTee})`, element);
};

const hasgrandElement = (element, ops) => {
  return getRegContent(`^${ops.vertical.trim()}`, element);
};
