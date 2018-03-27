const plugins = require('./plugins')
const resolve = require('./resolve')

const config = {
  plugins: plugins('main'),
  resolve,
}

module.exports = config
