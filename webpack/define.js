const webpack = require('webpack')

require('../src/globals')

module.exports = new webpack.DefinePlugin({
  __DEV__,
  __PROD__,
})
