const fileMap = require("./lib/fileMap");
const forEachMap = require("./lib/forEach");

module.exports = function (target) {
  return forEachMap(fileMap(target));
};

