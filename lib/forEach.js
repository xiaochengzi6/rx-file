let strs = [];
function main(node) {
    // const node = root(target);
    const arr = [];
    let string = "";

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
      str = str + arr[i] + "/";
    }
    str = str + element;
    strs.push(str);
  }
}

function forMap(map, arr) {
  map.forEach((element) => {
    if (element.stats == "DIR") {
      arr.push(element.value);
      forMap(element.children, arr);
    } else {
      // 进行字符串的叠加
      addString(element.value, arr, strs);
    }
  });
  arr.pop();
}