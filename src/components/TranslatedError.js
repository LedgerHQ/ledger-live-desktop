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
    if (typeof error === 'string') return error
    if (error.name) {
      const translation = t(`errors:${error.name}.${field}`, error)
      // FIXME in case the error don't exist in t we should not return and fallback code after. I just don't know how to check this. FIXME
      return translation
    }
    logger.warn(`TranslatedError: no translation for '${error.name}'`, error)
    return error.message || error.name || t(`errors:generic.${field}`)
  }
}

export default translate()(TranslatedError)
