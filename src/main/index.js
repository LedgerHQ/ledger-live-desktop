// @flow

process.setMaxListeners(0)

require('../env')
require('../globals')
require('./app')

setImmediate(() => require('./bridge'))
