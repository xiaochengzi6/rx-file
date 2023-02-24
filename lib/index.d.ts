interface defaultOptionsType {
  RootFlie: string,
  inheritRootfile: boolean,
  Dir: "DIR",
  File: "FILE",
  depth: number,
  pathSeparator: "/",
  throughTee: "├──",
  endTee: "└──",
  vertical: "│",
}

type FileOptions = { rootdir: '__dirname' | 'tmpdir' | 'none' }

declare function treeToFilePath(str: string, ops?: defaultOptionsType ): {
  fileMap: Map<string, any>
  filePath: string[],
  generateFile: (root: string, filePath: string[], ops: FileOptions) => string 
}

export = treeToFilePath
export as namespace treeToFilePath