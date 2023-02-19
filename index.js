"use strict";

const fileMap = require("./development/fileMap");

const forEachMap = require("./development/forEach");

const createFile = require("./development/createfile");

const { default_must } = require("./development/utils");

function create(root, path, options) {
  if (typeof path === "string") {
    path = treePath(path);
  }
  return createFile(root, path, options);
}

function treePath(target, options) {
  if (typeof target !== "object") {
    target = fileMap(target, options);
  }

  return forEachMap(target);
}

function main(target, default_opentions) {
  // 处理默认参数
  if (!default_opentions) {
    default_opentions = default_must;
  }
  var File_Node = fileMap(target);
  var File_Array_Path = forEachMap(File_Node);

  // 接收一个 根目录 一个配置对象
  function middleSetFilePath(root, options) {
    return createFile(root, File_Array_Path, options)
  }
  return {
    FileNode: File_Node,
    FilePathArrs: File_Array_Path,
    generFile: middleSetFilePath,
  };
}

module.exports = {
  main,
  create,
  treePath,
  fileMap,
  default_must,
};
