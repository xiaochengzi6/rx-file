const path = require("path");
const { main } = require("../development/fileMap.js");
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
  throughTee: "├──",
  endTee: "└──",
  vertical: "│",
};
let one = main('./template.txt', { sequences: { vertical: "|" } });

let arr = [];
arr.push(one[0].value);
let strs = [];

forMap(one[0].children, arr);

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
