const fileMap = require("./lib/fileMap");
const forEachMap = require("./lib/forEach");
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

module.exports = {
  treeTopath: function (target) {
    return forEachMap(fileMap(target, default_option = DEFAULT_OPTIONS));
  },
  defaultOptions: DEFAULT_OPTIONS
};
