const webpack = require('webpack')

require('./src/globals')

const config = {
  plugins: [
    new webpack.DefinePlugin({
      __DEV__,
      __PROD__,
    }),
  ],
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
