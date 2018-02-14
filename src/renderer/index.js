const Raven = require('raven-js')

require('../env')

const { SENTRY_URL } = process.env

if (__PROD__ && SENTRY_URL) {
  Raven.config(SENTRY_URL, { allowSecretKey: true }).install()
  window.addEventListener('unhandledrejection', event => Raven.captureException(event.reason))
}

require('./init')
