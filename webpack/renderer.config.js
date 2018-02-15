const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const plugins = require('./plugins')

const config = {
  plugins: [...plugins, new HardSourceWebpackPlugin()],
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
