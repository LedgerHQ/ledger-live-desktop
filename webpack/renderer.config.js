const plugins = require('./plugins')

const config = {
  plugins,
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
