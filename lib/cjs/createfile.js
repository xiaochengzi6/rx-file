'use strict';

const fs = require("fs");

const path = require("path");

const uniqueFilename = require("unique-filename");

const os = require("os");

module.exports = createFile;

function createFile(root, filearrs, options) {
  let str = "themplate-" + Math.random().toString(36).slice(2);
  let option_obj = {
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
  let rootPath = rootPathFunc(options, root);
  let dirPath;
  filearrs.forEach(function makedirorFile(element) {
    element = path.normalize(element);
    let {
      dir,
      ext
    } = path.parse(element);
    dirPath = path.join(rootPath, element);
    let filePath;

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
  let rootpath;

  switch (options.rootdir) {
    case "__dirname":
      rootpath = path.join(process.cwd(), root);

      if (fs.existsSync(rootpath)) {
        rootpath = uniqueFilename(process.cwd(), root, "create themplate");
      }

      break;

    case "tmpdir":
      rootpath = path.join(os.tmpdir(), root);

      if (fs.existsSync(rootpath)) {
        rootpath = uniqueFilename(os.tmpdir(), root, "create themplate");
      }

      break;

    case "none":
      rootpath = root;

      if (fs.existsSync(rootpath)) {
        rootpath = uniqueFilename(root, null, "create themplate");
      }

      break;

    default:
      throw Error(`${options.rootdir} Not a parameter`);
  }

  return rootpath;
}
