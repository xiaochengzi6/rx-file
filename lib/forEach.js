'use strict';

var _rollupPluginBabelHelpers = require('./_rollupPluginBabelHelpers-e0bdafbe.js');

var path = require("path");

var _require = require('./utils'),
    default_must = _require.default_must;

var strs = [];

function main(node, default_options) {
  if (Array.isArray(node) && node[0]) {
    node = node[0];
  }

  if (typeof node == null || _rollupPluginBabelHelpers._typeof(node) == undefined || !node.value) {
    throw Error('treePath Parameter error');
  }

  if (!default_options) {
    default_options = default_must;
  }

  var arr = [];

  if (node.children) {
    if (default_options && default_options.inheritRootfile) {
      arr.push(node.value);
    }

    arr.push('');
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
  var str = "";
  var lenght = arr.length;

  if (lenght) {
    for (var i = 0; i < lenght; i++) {
      str = str + arr[i] + path.sep;
    }

    str = str + element;
    strs.push(str);
  }
}

function forMap(map, arr) {
  map.forEach(function (element) {
    if (element.stats == "DIR") {
      arr.push(element.value);

      if (element.children.size == 0) {
        addString("", arr);
        arr.pop();
      } else {
        forMap(element.children, arr);
      }
    } else {
      addString(element.value, arr);
    }
  });
  arr.pop();
}
