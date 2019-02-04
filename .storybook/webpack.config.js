const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.yml$/,
        loaders: ['json-loader', 'yaml-loader'],
        include: path.resolve(__dirname, '../static/i18n'),
      },
    ],
  },
  node: {
    fs: 'empty',
  },
}
