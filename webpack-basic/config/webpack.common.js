const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
const devConfig = require('./webpack.dev')
const prodConfig = require('./webpack.prod')

const commonConfig = {
  entry: './src/index.js', // 项目的入口文件，也就是从这个文件开始打包
  module: {
    rules: [{
      test: /\.(jpg|png|gif|jpeg)$/,
      use: {
        loader: 'url-loader', // 需要安装另外的包
        options: {
          name: '[name].[ext]', // 打包后的文件名不改变，[name]和[ext]是占位符
          outputPath: 'images/', // 打包后的文件放在dist目录下的images文件夹中
          limit: 2048,
        },
      },
    }, {
      test: /\.(oet|ttf|svg)$/,
      use: {
        loader: 'file-loader',
      },
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
      ],
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new CleanWebpackPlugin(), // 默认清除的就是output中的path
  ],
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
        },
      }
    }
  },
  output: {
    // 打包后的文件所在的文件夹，必须使用绝对路径，需要用到node的核心模块 
    // __dirname表示当前目录
    path: path.resolve(__dirname, '../dist'),
    // publicPath: './' // 去掉的话，就可以直接用浏览器打开dist目录下的index.html了，而不需要启动服务器
  },
  performance: false, // 打包的时候不会提示性能上的问题，比如打包后生成的文件很大
}

module.exports = env => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  }
  return merge(commonConfig, devConfig)
}