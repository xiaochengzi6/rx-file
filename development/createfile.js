const fs = require("fs");
const path = require("path");
const uniqueFilename = require("unique-filename");
const os = require('os')

module.exports = createFile;

/**
 *用来接收一个节点 和 模板文件
 * @param {*} root 
 * @param {*} filearrs 
 */
function createFile(root, filearrs, options) {
  let option_obj = {
    rootdir: '__dirname',
    /*__dirname,  tmpdir, none*/
  }
  if(!options) options = option_obj;
  // 根节点  
  let rootPath = rootPathFunc(options, root);

  filearrs.forEach(function makedirorFile(element) {
    let { dir, base } = path.parse(element);
    // 文件夹的根节点
    let dirPath = path.join(rootPath, dir);
    let filePath
    // 文件的根节点
    if(base){filePath = path.join(rootPath, element)}

    if (!fs.existsSync(dirPath)) {
      fs.mkdir(dirPath, { recursive: true }, function (err) {
        if (err) throw err;
        // console.log('base',filePath)
        if (filePath) {
          fs.closeSync(fs.openSync(filePath, 'w'))
        }
      });
    }else{
      if(filePath && ! fs.existsSync(filePath)){
        fs.closeSync(fs.openSync(filePath, 'w'))
      }
    }
  });
}

function rootPathFunc (options, root) {
  let rootpath 
  switch (options.rootdir){
    case '__dirname':
      rootpath = uniqueFilename(process.cwd(), root, 'create themplate')
      break;
    case 'tmpdir':
      rootpath = uniqueFilename(os.tmpdir(), root, 'create themplate')
      break;
    case 'none':
      rootpath = uniqueFilename(root, null, 'create themplate')
    break;

    default:
      throw Error(`${options.rootdir} Not a parameter`)
  }
  return rootpath
}