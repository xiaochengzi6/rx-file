const fileMap = require("./fileMap");
const forEachMap = require("./forEach");

module.exports = function (target) {
  return forEachMap(fileMap(target));
};

