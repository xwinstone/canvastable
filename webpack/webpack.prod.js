const path = require('path');
const fs = require('fs');
const { merge } = require('webpack-merge')
const webpackCommon = require('./webpack.common')

const appDirectory = fs.realpathSync(process.cwd());

function getPath (dir = '') {
  return path.resolve(appDirectory, dir)
}
const PATH_DIST = getPath('umd');
const PATH_SRC = getPath('src');

module.exports = merge(webpackCommon, {
  entry: PATH_SRC + '/index.ts',
  output: {
    path: PATH_DIST,
    filename: 'canvastable.min.js',
    library: 'CanvasTable',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  mode: "production",
  plugins: [
  ]
});
