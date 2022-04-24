'use strict';

const path = require('path');
const fs = require('fs');
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
function Stringslice(target) {
  return target.split("\n");
}
function root(targetArrs, default_option) {
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
function isdir(element) {
  const elementTest = /\.[a-z]+/;
  let boolean = element.search(elementTest) == -1 ? true : false;
  return boolean;
}
function getFileOrDirName(element) {
  const name = /[a-zA-Z].+/;
  let value = name.exec(element);
  return value[0];
}
function hasList(element, default_option) {
  const Childtest = new RegExp(
    `^(${default_option.throughTee}|${default_option.endTee})`
  );
  try{
    let boolean = element.search(Childtest) !== -1 ? true : false;
    return boolean;
  }catch(err){
    throw Error("You should reset the defaults DEFAULT_OPTIONS.endTee || DEFAULT_OPTIONS.throughTee")
  }
}
function hasLastElement(element, default_option) {
  const Childtest = new RegExp(`${default_option.endTee}`);
  try{
    let boolean = element.search(Childtest) !== -1 ? true : false;
    return boolean;
  }catch(err){
    throw Error("You should reset the defaults DEFAULT_OPTIONS.endTee")
  }
}
function hasgrandElement(element, default_option) {
  const test = new RegExp(`^${default_option.vertical.trim()}`);
  try{
    let value = element.search(test) !== -1 ? true : false;
    return value;
  }catch(err){
    throw Error("You should reset the defaults DEFAULT_OPTIONS.vertical")
  }
}
function returnDepth(element, default_option) {
  let dirname = element.split(`${default_option.vertical}`);
  let dirlength = dirname.length - 1;
  dirname = dirname[dirlength].trim();
  return [dirname, dirlength];
}
function isFile(str, default_option) {
  const Childtest = new RegExp(`${default_option.endTee}`);
  return (
    str.search(/\//) !== -1 &&
    path.basename(str) != str &&
    str.search(Childtest) == -1
  );
}
function elementSplit(element) {
  let string = element.trim();
  let b = string.split(/([#][^#]+)$/)[0];
  return b;
}
function readfile(element) {
  const data = fs.readFileSync(element);
  let value = data.toString().trim();
  return value;
}
module.exports = {
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
};
