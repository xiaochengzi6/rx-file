const path = require("path");
const main = require("../index");

console.log(main)

// let a = main.fileMap('./template.txt')
// let b = main.treePath(a)

// or

let b = main.treePath('./template.txt')
// console.log(a)
console.log(b)