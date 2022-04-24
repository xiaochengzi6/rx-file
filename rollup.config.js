import cleanup from 'rollup-plugin-cleanup';
export default {
    // input: './development/fileMap.js',
    input: {
      fileMap: './development/fileMap.js',
      createfile: './development/createfile.js',
      forEach: './development/forEach.js',
      utils: './development/utils.js',
    },
    plugins: [cleanup()],
    output: {
      dir: './lib',
      format: 'cjs',
    }
  }