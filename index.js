"use strict"

const fileMap = require("./development/fileMap")

const forEachMap = require("./development/forEach")

const createFile = require("./development/createfile")

const { defaultOptions } = require("./development/utils")

function create(root, path, options) {
  if (typeof path === "string") {
    path = treePath(path);
  }
  return createFile(root, path, options)
}

function treePath(target, options) {
  if (typeof target !== "object") {
    target = fileMap(target, options)
  }

  return forEachMap(target)
}

function main(target, ops) {
  if (ops == null) {
    ops = defaultOptions
  } else {
    ops = Object.assign({}, defaultOptions, ops)
  }
  const fileNode = fileMap(target, ops)
  const filePath = forEachMap(fileNode, ops)

  return {
    fileNode,
    filePath, 
    generateFile: (root, ops) => {
      return createFile(root, filePath, ops)
    },
  };
}

module.exports = {
  main,
  create,
  treePath,
  fileMap,
  defaultOptions,
};
