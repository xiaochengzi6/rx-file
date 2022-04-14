const fileMap = require("./lib/fileMap");
const forEachMap = require("./lib/forEach");
const createFile = require('./lib/createfile')

let DEFAULT_OPTIONS = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  pathSeparator: "/",
  sequences: {
    throughTee: "├──",
    endTee: "└──",
    vertical: "|  ",
    emptyColumn: "   ",
  },
};
function createfile (root, file) {
  let Filearray = treetopath(file)
  return createFile(root, Filearray)
}
function treetopath (target) {
  return forEachMap(fileMap(target, default_option = DEFAULT_OPTIONS));
}

module.exports = {
  createFile : createfile,
  treeTopath: treetopath,
  defaultOptions: DEFAULT_OPTIONS
};


createfile('/themplate', './the.txt')