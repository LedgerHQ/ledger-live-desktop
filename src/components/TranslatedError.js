// @flow
// Convention:
// - errors we throw on our app will use a different error.name per error type
// - an error can have parameters, to use them, just use field of the Error object, that's what we give to `t()`
// - returned value is intentially not styled (is universal). wrap this in whatever you need

import logger from 'logger'
import { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'

type Props = {
  error: ?Error,
  t: T,
  field: 'title' | 'description',
}

class TranslatedError extends PureComponent<Props> {
  static defaultProps = {
    field: 'title',
  }
  render() {
    const { t, error, field } = this.props
    if (!error) return null
    if (typeof error !== 'object') {
      // this case should not happen (it is supposed to be a ?Error)
      logger.critical(`TranslatedError invalid usage: ${String(error)}`)
      if (typeof error === 'string') {
        return error // TMP in case still used somewhere
      }
      return null
    }
    // $FlowFixMe
    const arg: Object = Object.assign({ message: error.message }, error)
    if (error.name) {
      const translation = t(`app:errors.${error.name}.${field}`, arg)
      if (translation !== `errors.${error.name}.${field}`) {
        // It is translated
        return translation
      }
    }
    return t(`apps:errors.generic.${field}`, arg)
  }
}

export default translate()(TranslatedError)
