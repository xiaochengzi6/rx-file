const fs = require("fs");
const path = require("path");
const uniqueFilename = require("unique-filename");
const os = require("os");

module.exports = createFile;

/**
 *用来接收一个目录名 和 路径数组
 * @param {*} root
 * @param {*} filePathArr
 */
function createFile(filePathArr, root, options) {
  let str = "themplate-" + Math.random().toString(36).slice(2);
  let option_obj = {
    rootdir: "__dirname",
    /*__dirname,  tmpdir, none*/
  };
  // 判断路径
  if (!root) {
    root = str;
  } else {
    if (typeof root !== "string") {
      root = root.toString() ? root.toString() : str;
    }
  }
  // 判断接收的东西是否是数组格式
  if (!Array.isArray(filePathArr)) {
    throw Error("The parameter is array");
  }
  // 给出默认配置
  if (!options || !options["rootdir"]) options = option_obj;
  
  // 根节点 的命名
  // 用户想在某一路径下生成这些文件所以文件名要对-如果文件名存在才会对其采取一定的措施
  // 文件名存在才会去创建
  let rootPath = rootPathFunc(options, root);


  let dirPath;
  filePathArr.forEach(function makedirorFile(element) {
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
      // 添加一个判断机制 看看是否存在 这个文件名的文件
      rootpath = path.join(process.cwd(), root);
      if(fs.existsSync(rootpath)){
        // 生成一个 带有 hash 值的文件名避免文件名命名失败
        rootpath = uniqueFilename(process.cwd(), root, "create themplate");
      }
      break;
    case "tmpdir":
      rootpath = path.join(os.tmpdir(), root);
      if(fs.existsSync(rootpath)){
        rootpath = uniqueFilename(os.tmpdir(), root, "create themplate");
      }
      break;
    case "none":
      rootpath = root;
      if(fs.existsSync(rootpath)){
        rootpath = uniqueFilename(root, null, "create themplate");
      }
      break;

    default:
      throw Error(`${options.rootdir} Not a parameter`);
  }
  return rootpath;
}
