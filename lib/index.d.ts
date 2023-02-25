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

type CreateFile = (filePathArr: string[], root?: string, ops?: FileOptions) => void 

declare function treeToFilePath(str: string, ops?: defaultOptionsType ): {
  fileMap: Map<string, any>
  filePath: string[],
  generateFile: (root?: string, ops?: FileOptions) => CreateFile
}

export = treeToFilePath
export as namespace treeToFilePath