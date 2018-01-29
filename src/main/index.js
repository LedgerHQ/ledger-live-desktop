// @flow

require('env')

process.setMaxListeners(0)

require('../globals')
require('./bridge')
require('./app')

if (__PROD__ && __SENTRY_URL__) {
  const Raven = require('raven') // eslint-disable-line global-require
  const ravenConfig = { captureUnhandledRejections: true }
  Raven.config(__SENTRY_URL__, ravenConfig).install()
}
