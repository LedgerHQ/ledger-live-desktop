const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const plugins = require('./plugins')
const resolve = require('./resolve')
const rules = require('./rules')

const config = {
  mode: __ENV__,
  resolve,
  plugins: [...plugins('renderer'), new HardSourceWebpackPlugin()],
  module: {
    rules,
  },
  devServer: {
    historyApiFallback: true,
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
