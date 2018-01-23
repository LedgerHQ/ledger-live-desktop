require('dotenv').config()
const webpack = require('webpack')

require('../src/globals')

module.exports = [
  new webpack.DefinePlugin({
    __DEV__,
    __PROD__,
    __SENTRY_URL__: JSON.stringify(process.env.SENTRY_URL),
    'process.env.NODE_ENV': JSON.stringify(__ENV__),
  }),
]
