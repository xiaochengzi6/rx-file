import cleanup from 'rollup-plugin-cleanup';
import {babel} from '@rollup/plugin-babel';
export default {
    input: {
      index: './development/index.js',
      createfile: './development/createfile.js',
    },
    plugins: [cleanup(), babel({ babelHelpers: 'bundled' })],
    output: {
      dir: './lib/cjs',
      format: 'cjs',
      name: 'index',
    }
  }