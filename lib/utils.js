'use strict';

var _rollupPluginBabelHelpers = require('./_rollupPluginBabelHelpers-e0bdafbe.js');

var path = require('path');

var fs = require('fs');

var default_must = {
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

var Node = /*#__PURE__*/function () {
  function Node(value, stats) {
    _rollupPluginBabelHelpers._classCallCheck(this, Node);

    this.value = value;
    this.stats = stats;
    this.children = new Map();
  }

  _rollupPluginBabelHelpers._createClass(Node, [{
    key: "addChild",
    value: function addChild(value, stats) {
      if (!this.children.has(value)) {
        var newNode = new Node(value, stats);
        this.children.set(value, newNode);
        return newNode;
      }

      return this.children.get(value);
    }
  }]);

  return Node;
}();

function Stringslice(target) {
  return target.split("\n");
}

function root(targetArrs, default_option) {
  var text = /^[a-zA-Z]+(\/){0,1}([a-zA-Z]+)/;
  var rootNode, value;
  targetArrs.forEach(function (element, index) {
    element.search(text) !== -1 ? value = text.exec(element) : "";
  });

  if (!value) {
    rootNode = new Node(default_option.RootFlie, default_option.Dir);
  } else {
    rootNode = new Node(value[0], default_option.Dir);
    targetArrs.shift();
  }

  return rootNode;
}

function isdir(element) {
  var elementTest = /\.[a-z]+/;

  var _boolean = element.search(elementTest) == -1 ? true : false;

  return _boolean;
}

function getFileOrDirName(element) {
  var name = /[a-zA-Z].+/;
  var value = name.exec(element);
  return value[0];
}

function hasList(element, default_option) {
  var Childtest = new RegExp("^(".concat(default_option.throughTee, "|").concat(default_option.endTee, ")"));

  try {
    var _boolean2 = element.search(Childtest) !== -1 ? true : false;

    return _boolean2;
  } catch (err) {
    throw Error("You should reset the defaults DEFAULT_OPTIONS.endTee || DEFAULT_OPTIONS.throughTee");
  }
}

function hasLastElement(element, default_option) {
  var Childtest = new RegExp("".concat(default_option.endTee));

  try {
    var _boolean3 = element.search(Childtest) !== -1 ? true : false;

    return _boolean3;
  } catch (err) {
    throw Error("You should reset the defaults DEFAULT_OPTIONS.endTee");
  }
}

function hasgrandElement(element, default_option) {
  var test = new RegExp("^".concat(default_option.vertical.trim()));

  try {
    var value = element.search(test) !== -1 ? true : false;
    return value;
  } catch (err) {
    throw Error("You should reset the defaults DEFAULT_OPTIONS.vertical");
  }
}

function returnDepth(element, default_option) {
  var dirname = element.split("".concat(default_option.vertical));
  var dirlength = dirname.length - 1;
  dirname = dirname[dirlength].trim();
  return [dirname, dirlength];
}

function isFile(str, default_option) {
  var Childtest = new RegExp("".concat(default_option.endTee));
  return str.search(/\//) !== -1 && path.basename(str) != str && str.search(Childtest) == -1;
}

function elementSplit(element) {
  var string = element.trim();
  var b = string.split(/([#][^#]+)$/)[0];
  return b;
}

function readfile(element) {
  var data = fs.readFileSync(element);
  var value = data.toString().trim();
  return value;
}

module.exports = {
  Node: Node,
  Stringslice: Stringslice,
  root: root,
  isdir: isdir,
  getFileOrDirName: getFileOrDirName,
  hasList: hasList,
  hasLastElement: hasLastElement,
  returnDepth: returnDepth,
  isFile: isFile,
  elementSplit: elementSplit,
  readfile: readfile,
  hasgrandElement: hasgrandElement,
  default_must: default_must
};
