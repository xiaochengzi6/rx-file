'use strict';

var fs = require("fs");

var path = require("path");

var uniqueFilename = require("unique-filename");

var os = require("os");

module.exports = createFile;

function createFile(root, filearrs, options) {
  var str = "themplate" + Math.random().toString(36).slice(2);
  var option_obj = {
    rootdir: "__dirname"
  };

  if (!root) {
    root = str;
  } else {
    if (typeof root !== "string") {
      root = root.toString() ? root.toString() : str;
    }
  }

  if (!Array.isArray(filearrs)) {
    throw Error("The parameter is array");
  }

  if (!options || !options["rootdir"]) options = option_obj;
  var rootPath = rootPathFunc(options, root);
  var dirPath;
  filearrs.forEach(function makedirorFile(element) {
    element = path.normalize(element);

    var _path$parse = path.parse(element),
        dir = _path$parse.dir,
        ext = _path$parse.ext;

    dirPath = path.join(rootPath, element);
    var filePath;

    if (ext) {
      filePath = path.join(rootPath, element);
      dirPath = path.join(rootPath, dir);
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, {
        recursive: true
      }, function (err) {
        if (err) throw err;

        if (filePath) {
          fs.closeSync(fs.openSync(filePath, "w"));
        }
      });
    } else {
      if (filePath && !fs.existsSync(filePath)) {
        fs.closeSync(fs.openSync(filePath, "w"));
      }
    }
  });
  return dirPath;
}

function rootPathFunc(options, root) {
  var rootpath;

  switch (options.rootdir) {
    case "__dirname":
      rootpath = uniqueFilename(process.cwd(), root, "create themplate");
      break;

    case "tmpdir":
      rootpath = uniqueFilename(os.tmpdir(), root, "create themplate");
      break;

    case "none":
      rootpath = uniqueFilename(root, null, "create themplate");
      break;

    default:
      throw Error("".concat(options.rootdir, " Not a parameter"));
  }

  return rootpath;
}
