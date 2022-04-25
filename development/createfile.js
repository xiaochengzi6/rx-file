const fs = require("fs");
const path = require("path");
const uniqueFilename = require("unique-filename");
const os = require("os");

module.exports = createFile;

/**
 *用来接收一个目录名 和 路径数组
 * @param {*} root
 * @param {*} filearrs
 */
function createFile(root, filearrs, options) {
  let str = "themplate-" + Math.random().toString(36).slice(2);
  let option_obj = {
    rootdir: "__dirname",
    /*__dirname,  tmpdir, none*/
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
  // 根节点
  let rootPath = rootPathFunc(options, root);
  let dirPath;
  filearrs.forEach(function makedirorFile(element) {
    element = path.normalize(element)
    let { dir, ext } = path.parse(element);
    // 文件夹的根节点
    dirPath = path.join(rootPath, element);
    let filePath;
    // 文件的根节点
    if (ext) {
      filePath = path.join(rootPath, element);
      dirPath = path.join(rootPath, dir)
    }
    // 文件夹不存在就创建文件夹
    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, { recursive: true }, function (err) {
        if (err) throw err;
        if (filePath) {
          fs.closeSync(fs.openSync(filePath, "w"));
        }
      });
      
    }
    // 文件夹存在就去创建文件 
    else {
      if (filePath && !fs.existsSync(filePath)) {
        fs.closeSync(fs.openSync(filePath, "w"));
      }
    }
  });
  // 返回文件夹的根节点
  return dirPath;
}

function rootPathFunc(options, root) {
  let rootpath;
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
      throw Error(`${options.rootdir} Not a parameter`);
  }
  return rootpath;
}
