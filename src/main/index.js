// @flow

require('env')

const { SENTRY_URL } = process.env

if (__PROD__ && SENTRY_URL) {
  const Raven = require('raven') // eslint-disable-line global-require
  const ravenConfig = { captureUnhandledRejections: true }
  Raven.config(SENTRY_URL, ravenConfig).install()
}

process.setMaxListeners(0)

require('../globals')
require('./app')

setImmediate(() => require('./bridge')) // eslint-disable-line global-require
