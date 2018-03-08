const path = require('path')
const fs = require('fs')
const webpackMain = require('electron-webpack/webpack.main.config')

const plugins = require('./plugins')

const dirs = p =>
  fs
    .readdirSync(p)
    .filter(f => fs.statSync(path.join(p, f)).isDirectory())
    .map(d => path.resolve(__dirname, `${p}/${d}`))
    .reduce((result, value) => {
      const [key] = value.split(path.sep).slice(-1)
      result[key] = value
      return result
    }, {})

module.exports = webpackMain().then(config => ({
  context: config.context,
  devtool: config.devtool,
  target: config.target,

  entry: {
    ...dirs(path.resolve(__dirname, '../src/internals')),
    index: path.resolve(__dirname, '../src/internals/index'),
  },

  resolve: {
    extensions: config.resolve.extensions,
  },

  externals: ['node-hid', ...config.externals],

  output: {
    ...config.output,
    path: path.resolve(__dirname, '../dist/internals'),
  },

  module: config.module,

  plugins: [...plugins('internals'), ...config.plugins],
}))
