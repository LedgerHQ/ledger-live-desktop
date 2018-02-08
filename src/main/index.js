// @flow

require('env')

process.setMaxListeners(0)

require('../globals')
require('./app')

setImmediate(() => require('./bridge')) // eslint-disable-line global-require

if (__PROD__ && __SENTRY_URL__) {
  const Raven = require('raven') // eslint-disable-line global-require
  const ravenConfig = { captureUnhandledRejections: true }
  Raven.config(__SENTRY_URL__, ravenConfig).install()
}
