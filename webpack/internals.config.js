const path = require('path')
const fs = require('fs')

const define = require('./define')

const dirs = p =>
  fs
    .readdirSync(p)
    .filter(f => fs.statSync(path.join(p, f)).isDirectory())
    .map(d => path.resolve(__dirname, `${p}/${d}`))
    .reduce((result, value) => {
      const [key] = value.split('/').slice(-1)
      result[key] = value
      return result
    }, {})

module.exports = {
  target: 'node',

  entry: dirs(path.resolve(__dirname, '../src/internals')),

  externals: {
    'node-hid': 'commonjs node-hid',
  },

  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

  plugins: [define],
}
