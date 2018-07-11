const plugins = require('./plugins')
const resolve = require('./resolve')
const rules = require('./rules')

const config = {
  mode: __ENV__,
  plugins: plugins('main'),
  resolve,
  module: {
    rules,
  },
  optimization: {
    minimize: false,
  },
}

module.exports = config
