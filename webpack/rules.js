const babelConfig = require('../babel.config')

module.exports = [
  {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      babelrc: false,
      ...babelConfig(),
    },
  },
]
