// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

export default {
  external: [
    'os',
    'http',
    'https',
    'url',
    'zlib',
    'assert',
    'stream',
    'tty',
    'util'
  ],
  input: 'lib/Item.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    commonjs({
      namedExports: {
        'node_modules/lodash/lodash.js': ['get', 'isArray', 'has']
      }
    }),
    json()
  ]
};
