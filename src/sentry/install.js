// @flow
import anonymizer from 'helpers/anonymizer'
/* eslint-disable no-continue */

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
    dataCallback: (data: mixed) => {
      // We are mutating the data to anonymize everything.

      if (typeof data !== 'object' || !data) return data

      delete data.server_name // hides the user machine name
      if (typeof data.request === 'object' && data.request) {
        const { request } = data
        if (typeof request.url === 'string') {
          request.url = anonymizer.appURI(request.url)
        }
      }

      if (data.breadcrumbs && typeof data.breadcrumbs === 'object') {
        const { breadcrumbs } = data
        if (Array.isArray(breadcrumbs.values)) {
          const { values } = breadcrumbs
          for (const b of values) {
            if (!b || typeof b !== 'object') continue
            if (b.category === 'xhr' && b.data && typeof b.data === 'object') {
              const { data } = b
              if (typeof data.url === 'string') {
                data.url = anonymizer.url(data.url)
              }
            }
          }
        }
      }

      if (data.exception && typeof data.exception === 'object') {
        const { exception } = data
        if (Array.isArray(exception.values)) {
          const { values } = exception
          for (const value of values) {
            if (value && typeof value === 'object') {
              const { stacktrace } = value
              if (stacktrace && typeof stacktrace === 'object') {
                if (Array.isArray(stacktrace.frames)) {
                  const { frames } = stacktrace
                  for (const frame of frames) {
                    if (frame && typeof frame === 'object' && typeof frame.filename === 'string') {
                      frame.filename = anonymizer.filepath(frame.filename)
                    }
                  }
                }
              }
            }
          }
        }
      }

      console.log('Sentry=>', data) // eslint-disable-line
      return data
    },
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
