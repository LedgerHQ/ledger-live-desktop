const webpack = require('webpack')
const Dotenv = require('dotenv-webpack')

require('../src/globals')

module.exports = [
  new Dotenv(),
  new webpack.DefinePlugin({
    __DEV__,
    __PROD__,
    'process.env.NODE_ENV': JSON.stringify(__ENV__),
  }),
]
