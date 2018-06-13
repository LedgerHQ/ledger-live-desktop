// @flow

require('../env')

const { SENTRY_URL } = process.env

export default (Raven: any, shouldSendCallback: () => boolean, userId: string) => {
  if (!SENTRY_URL) return
  let r = Raven.config(SENTRY_URL, {
    captureUnhandledRejections: true,
    allowSecretKey: true,
    release: __APP_VERSION__,
    environment: __DEV__ ? 'development' : 'production',
    shouldSendCallback,
  })
  const user = {
    ip_address: null,
    id: userId,
  }
  if (r.setUserContext) {
    r = r.setUserContext(user)
  } else if (r.setContext) {
    r = r.setContext({ user })
  }
  r.install()
}
