const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const webpackMain = require('electron-webpack/webpack.main.config') // eslint-disable-line import/no-extraneous-dependencies

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

module.exports = webpackMain().then(config => ({
  target: 'electron-main',

  entry: dirs(path.resolve(__dirname, '../src/internals')),

  resolve: {
    extensions: ['.js', '.json', '.node'],
  },

  externals: config.externals,

  output: {
    path: path.resolve(__dirname, '../dist/internals'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },

  plugins: [define, new webpack.optimize.ModuleConcatenationPlugin()],
}))
