// @flow
// Convention:
// - errors we throw on our app will use a different error.name per error type
// - an error can have parameters, to use them, just use field of the Error object, that's what we give to `t()`
// - returned value is intentially not styled (is universal). wrap this in whatever you need

import { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'

type Props = {
  error: ?Error,
  t: T,
}

class TranslatedError extends PureComponent<Props> {
  render() {
    const { t, error } = this.props
    if (!error) return null
    if (typeof error === 'string') return error
    return t(`errors:${error.name}`, error)
  }
}

export default translate()(TranslatedError)
