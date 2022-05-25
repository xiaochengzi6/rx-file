'use strict';

var _rollupPluginBabelHelpers = require('./_rollupPluginBabelHelpers-e0bdafbe.js');

require("path");

require("fs");

var _require = require("./utils.js");
    _require.Node;
    var Stringslice = _require.Stringslice,
    root = _require.root,
    isdir = _require.isdir,
    getFileOrDirName = _require.getFileOrDirName,
    hasList = _require.hasList,
    hasLastElement = _require.hasLastElement,
    returnDepth = _require.returnDepth,
    isFile = _require.isFile,
    elementSplit = _require.elementSplit,
    readfile = _require.readfile,
    hasgrandElement = _require.hasgrandElement,
    default_must = _require.default_must;

var stack = [];
var deptch = [];
module.exports = main;

function main(stringArrs, default_option) {
  if (typeof default_option === null || _rollupPluginBabelHelpers._typeof(default_option) === undefined) {
    default_option = default_must;
  } else {
    default_option = Object.assign({}, default_must, default_option);
  }

  if (!_rollupPluginBabelHelpers._typeof(stringArrs) == "string") {
    throw Error("Parameter must specify the form of a string");
  }

  stringArrs = stringArrs.trim();
  var target;

  if (isFile(stringArrs, default_option)) {
    try {
      stringArrs = readfile(stringArrs);
    } catch (err) {
      throw Error("Wrong file path");
    }
  }

  target = Stringslice(stringArrs);
  var nodeRoot = root(target, default_option);
  stack.push(nodeRoot);
  forEachTarget(target, default_option);
  return stack;
}

function addElementNode(value, stats, dirlength, default_option) {
  var length = default_option.depth;
  var i = 1;

  function feare(dirlength, node, i, length) {
    try {
      if (dirlength > Number(length)) {
        return;
      }
    } catch (err) {
      throw Error(" depth Parameter error should be Number!!!");
    }

    var w;

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
  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];
    target = elementSplit(target);
    child(target, default_option);
  }
}

function depathforEach() {
  if (deptch.length >= 2) {
    var lastElement = deptch[deptch.length - 1];
    var length = deptch.length;

    var _loop = function _loop(i) {
      if (lastElement.depath == deptch[i].depath) {
        stack = stack.filter(function (arr, j) {
          return arr != deptch[i].value;
        });
        deptch.splice(i, deptch.length - 1);

        if (length > 2) {
          deptch.push(lastElement);
        }

        if (stack.length > deptch.length + 1) {
          var _length = deptch.length;
          stack = stack.filter(function (arr, j) {
            return j <= _length;
          });
          stack.pop();
          stack.push(lastElement.value);
        }

        return {
          v: void 666
        };
      }
    };

    for (var i = deptch.length - 2; i >= 0; i--) {
      var _ret = _loop(i);

      if (_rollupPluginBabelHelpers._typeof(_ret) === "object") return _ret.v;
    }
  }

  return void 666;
}

function child(target, default_option) {
  if (!!target == false) {
    return void 666;
  }

  var _returnDepth = returnDepth(target, default_option),
      _returnDepth2 = _rollupPluginBabelHelpers._slicedToArray(_returnDepth, 2),
      targetElement = _returnDepth2[0],
      dirlength = _returnDepth2[1];

  var ischildrenElement = hasList(targetElement, default_option);
  var isgrandElement = ischildrenElement ? false : hasgrandElement(target, default_option);

  if (ischildrenElement) {
    var value = getFileOrDirName(targetElement);

    if (isdir(value)) {
      deptch.push({
        value: value,
        depath: dirlength
      });
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
