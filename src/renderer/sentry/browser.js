const Raven = require('raven-js')
require('../../env')
import user from 'helpers/user'

const { SENTRY_URL } = process.env

export default shouldSendCallback => {
  Raven.config(SENTRY_URL, {
    allowSecretKey: true,
    release: __APP_VERSION__,
    environment: __DEV__ ? 'development' : 'production',
    shouldSendCallback,
  })
    .setUserContext({
      ip_address: null,
      id: user().id,
    })
    .install()
}
