// @flow

import Raven from 'raven'
import install from './install'

export default (shouldSendCallback: () => boolean, userId: string) => {
  install(Raven, shouldSendCallback, userId)
}
