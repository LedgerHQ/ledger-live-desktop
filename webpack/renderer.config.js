const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const plugins = require('./plugins')
const resolve = require('./resolve')
const rules = require('./rules')

const config = {
  mode: __ENV__,
  plugins: [...plugins('renderer'), new HardSourceWebpackPlugin()],
  resolve,
  module: {
    rules,
  },
  devServer: {
    historyApiFallback: true,
  },
  optimization: {
    minimize: false,
  },
}

if (__DEV__) {
  Object.assign(config, {
    output: {
      publicPath: '/',
    },
  })
}

module.exports = config
