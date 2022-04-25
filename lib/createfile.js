'use strict';

var fs = require("fs");

var path = require("path");

var uniqueFilename = require("unique-filename");

var os = require('os');

module.exports = createFile;

function createFile(root, filearrs, options) {
  var option_obj = {
    rootdir: '__dirname'
  };
  if (!options) options = option_obj;
  var rootPath = rootPathFunc(options, root);
  filearrs.forEach(function makedirorFile(element) {
    var _path$parse = path.parse(element),
        dir = _path$parse.dir,
        base = _path$parse.base;

    var dirPath = path.join(rootPath, dir);
    var filePath;

    if (base) {
      filePath = path.join(rootPath, element);
    }

    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, {
        recursive: true
      }, function (err) {
        if (err) throw err;

        if (filePath) {
          fs.closeSync(fs.openSync(filePath, 'w'));
        }
      });
    } else {
      if (filePath && !fs.existsSync(filePath)) {
        fs.closeSync(fs.openSync(filePath, 'w'));
      }
    }
  });
}

function rootPathFunc(options, root) {
  var rootpath;

  switch (options.rootdir) {
    case '__dirname':
      rootpath = uniqueFilename(process.cwd(), root, 'create themplate');
      break;

    case 'tmpdir':
      rootpath = uniqueFilename(os.tmpdir(), root, 'create themplate');
      break;

    case 'none':
      rootpath = uniqueFilename(root, null, 'create themplate');
      break;

    default:
      throw Error("".concat(options.rootdir, " Not a parameter"));
  }

  return rootpath;
}
