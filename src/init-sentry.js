const { SENTRY_URL } = process.env

if (__PROD__ && SENTRY_URL) {
  // const Raven = require('raven')
  // const ravenConfig = { captureUnhandledRejections: true }
  // Raven.config(SENTRY_URL, ravenConfig).install()
}
