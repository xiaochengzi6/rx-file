![Image](https://github.com/xiaochengzi6/rx-file/blob/v3.0/logo.jpg)
![npm](https://img.shields.io/npm/v/rx-file)
![npm bundle size](https://img.shields.io/bundlephobia/min/rx-file)
![NPM](https://img.shields.io/npm/l/rx-file)
[![NPM](https://img.shields.io/badge/中文-readme-red)](https://github.com/xiaochengzi6/rx-file/blob/v3.0/readmeCN.md)

## Introduction

rx-file is a quick template file creation tool that solves the problem of creating a large number of files manually.

## Download

~~~shell
yarn add --dev rx-file
~~~

## Main Function 

Using the tree name to obtain a file tree and convert it into a file path (generate files) is very suitable for creating a large number of template files and deep nesting directories

## Quick Use 
~~~js
const treeToFilePath = require('../lib/index')

// The passed parameter can be a relative path to the file (store the copy file tree) or a file tree
const rxFileResult = treeToFilePath('./template.txt')
// const rxFileResult = treeToFilePath(template)


// ./template.txt
const templateTxt = `
home/user
├── foo.js
├── test
|  ├── bar.js
|  └── baz.js
└── bat.js
`
const {generateFile} = rxFileResult

// create file
generateFile()
~~~

## Tutorial

`treeToFilePath` returns two properties and a method to create the file. Most of the time, the method `generateFile` is called to create the file without using the properties

~~~ts
const rxFileResult = treeToFilePath('./template.txt')
const {fileMap, filePath, generateFile} = rxFileResult 
~~~

- `fileMap: Map<string, Node>`: Returns a file - level structure
- `filePath: string[]` : This property stores the relative path of each file 
- `generateFile: (root?: string, ops?: FileOptions) => Function;` : To create a file
  - `root`:  The root argument is not required you can ignore it and it will create a name of its own which is something like 'themplate-xxxxxxxx' you can specify that it is a file name or a relative path or even an absolute path and when you specify an absolute path you need to specify the third argument as`{rootdir: 'none'}`;
  - `ops`: What rules are used to determine the template files to be generated


~~~ts
const ops = {
  rootdir: 'none'
}

generateFile(root, ops)
/**
 * root：  Relative path|  Absolute path (The third argument of the function must be passed in when used{rootdir: 'none'})
 * 
 * ops:  { rootdir: '__dirname' | 'tmpdir' | 'none' }
 * 
 * ops.rootdir:
 *   "__dirname" : The default option is used to build under the current folder
 *   "tmpdir"    : Generated in os.tmpdir
 *   "none"      : The whole argument indicates that your root argument is an absolute path
 */
~~~


## Advanced Settings
>You usually don't need to configure this option, but the format of the file tree generated under different commands varies greatly, providing you with an optional operation for precise matching

The configuration item 'defaultOptions' is very necessary. It's the foundation and the core of the rules for dealing with file tree templates. Most of the time you don't need this when your template file doesn't match the default and you need to use it.

~~~js
const defaultOptions = {
  nullFlie: "NULLFILE",
  Dir: "DIR",
  File: "FILE",
  depth: 5,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "|",
};
~~~

**Configurable**

`depth` : File iteration depth is ignored when your folder is deeper than this

`pathSeparator`: The symbol 'pathSeparator: "/"' is used to delimit the path of a file when it is processed. This property is generally not configured. By default it is' \\ 'in Windows and'/' in linux

`throughTee`: The symbol 'throughTee: "└──"' for the file (directory) is in one of these

`endTee`: The last node symbol 'endTee: "temperature ─"' means that the file (directory) is the last one of the parent

`vertical`: Sun file symbol ` vertical: "|" ` file or directory has one or more before, determine its level




**Pay attention**
> Not recommended If you change these, you are likely to get the wrong message
> 
`nullFlie`: The root node replaces the root node name if it is not available

`Dir`: Tag directory node

`File`: Mark file node

For example:

~~~js
{
  endTee: '|' 
}

// Use
const treeToFilePath = require('rx-file')
treeToFilePath('./xxx.txt', {endTee: '|'})

~~~

Override the default properties in this way

Usually the most important throughTee, endTee and vertical that you use, you just need to make sure that these three are correct when you're using them.

## Warning⚠

 Before using it you must make sure that the default symbols and your template styles match 'rx-file' modules are matched in a regular way it is not particularly smart and you must follow the rules accordingly

1. If it is the last file or the last directory you must use the symbol "pheo --" or you can specify the symbol '{endTee: "symbol for the last file or directory "}'

2. You need to choose the appropriate file tree format

A file tree it is in the form of this' └─ 'used to represent the child node' └─ 'used to represent the last file or directory' # 'You can add comments after the whole symbol

~~~
home/user
├── foo.js
├── test
|  ├── bar.js # this is comment
|  └── baz.js
└── bat.js
~~~

3. The directory name is not allowed to contain '.js' or '.css 'related characters. When there are'. 'characters, it is considered as a file

4. Try to name the directory properly otherwise you may see the path to it but the file creation may fail or the file name may not be what you expected

5. If you ignore the above two points you will get the opposite of what you expect.

