const path = require('path');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());

function getPath (dir = '') {
  return path.resolve(appDirectory, dir)
}

const PATH_SRC = getPath('src');
const MATCH_NODE_MODULES = '/node_modules/';

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts', '.scss', '.css']
  },
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
          }
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
  }
};
