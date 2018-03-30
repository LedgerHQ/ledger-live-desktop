const babelConfig = require('../babel.config')

const { NODE_ENV } = process.env

module.exports = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      babelrc: false,
      cacheDirectory: NODE_ENV === 'development',
      ...babelConfig(),
    },
    exclude: /node_modules/,
  },
]
