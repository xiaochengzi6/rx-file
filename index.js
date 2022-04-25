'use strict';

const fileMap = require("./lib/fileMap");

const forEachMap = require("./lib/forEach");

const createFile = require("./lib/createfile");

let default_options = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "|"
};

function create(root, path, options) {
  if (typeof path === 'string') {
    path = treePath(path);
  }
  return createFile(root, path, options);
}

function treePath(target, options) {
  if (typeof target !== 'object') {
    target = fileMap(target, options);
  }

  return forEachMap(target);
}

module.exports = {
  create,
  treePath,
  fileMap,
  default_options
};
