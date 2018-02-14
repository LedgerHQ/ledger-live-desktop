const webpack = require('webpack')

require('../src/globals')

module.exports = [
  new webpack.DefinePlugin({
    __DEV__,
    __PROD__,
    'process.env.NODE_ENV': JSON.stringify(__ENV__),
  }),
]
