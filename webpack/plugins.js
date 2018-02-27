const webpack = require('webpack')

require('../src/globals')

module.exports = [
  new webpack.DefinePlugin({
    __GLOBAL_STYLES__: JSON.stringify(__GLOBAL_STYLES__),
    __DEV__,
    __PROD__,
    'process.env.NODE_ENV': JSON.stringify(__ENV__),
  }),
]
