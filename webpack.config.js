const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());

function getPath (dir = '') {
  return path.resolve(appDirectory, dir)
}

const PATH_SRC = getPath('src');
const PATH_DIST = getPath('devdist');
const MATCH_NODE_MODULES = '/node_modules/';

const pkg = require(getPath('package.json'));
const projectName = pkg.projectName;

module.exports = {
  entry: PATH_SRC + '/test.tsx',
  output: {
    pathinfo: true,
    filename: '[name].[hash].js',
    path: PATH_DIST,
    chunkFilename: '[name].[hash].js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.scss', '.css']
  },
  watchOptions: {
    //不监听的node_modules目录下的文件,
    ignored: /node_modules/
  },
  devServer: {
    contentBase: './devdist',
    host: '0.0.0.0',
    index: './test.html'
  },
  mode: "development",
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: MATCH_NODE_MODULES,
        include: PATH_SRC,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // {
      //     enforce: "pre",
      //     test: /\.js$/,
      //     loader: "source-map-loader"
      // },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/'
            }
          },
          'image-webpack-loader'
        ],
        exclude: MATCH_NODE_MODULES,
        include: PATH_SRC
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.(mov|mp4)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'videos/'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: getPath()
    }),
    new HtmlWebpackPlugin({
      title: projectName,
      filename: 'test.html',
      template: getPath('src/test.html'),
    }),
    // new webpack.DefinePlugin({
    //   'process.env': configFile
    // }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
