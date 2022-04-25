import cleanup from 'rollup-plugin-cleanup';
import {babel} from '@rollup/plugin-babel';
export default {
    input: {
      fileMap: './development/fileMap.js',
      createfile: './development/createfile.js',
      forEach: './development/forEach.js',
      utils: './development/utils.js',
    },
    plugins: [cleanup(), babel({ babelHelpers: 'bundled' })],
    output: {
      dir: './lib',
      format: 'cjs',
      name: 'index',
    }
  }