// @flow

import Raven from 'raven-js'
import user from 'helpers/user'
import install from './install'

export default (shouldSendCallback: () => boolean) => {
  install(Raven, shouldSendCallback, user().id)
}
