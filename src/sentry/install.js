// @flow

require('../env')

export default (Raven: any, shouldSendCallback: () => boolean, userId: string) => {
  if (!__SENTRY_URL__) return
  let r = Raven.config(__SENTRY_URL__, {
    captureUnhandledRejections: true,
    allowSecretKey: true,
    release: __APP_VERSION__,
    tags: { git_commit: __GIT_REVISION__ },
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
