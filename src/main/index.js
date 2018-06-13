// @flow

process.setMaxListeners(0)

require('../env')
require('../globals')
// require('../init-sentry')
require('./app')

setImmediate(() => require('./bridge'))
