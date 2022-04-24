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
  vertical: "|",
};
function create(root, file) {
  let Filearray = treetopath(file);
  return createFile(root, Filearray);
}
function treePath(target) {
  if(typeof target !== 'object'){
   target = fileMap(target)
  }
  return forEachMap(target);
}

module.exports = {
  create,
  treePath,
  fileMap,
  default_options
};
