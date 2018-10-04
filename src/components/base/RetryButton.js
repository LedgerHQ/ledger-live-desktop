// @flow

import React, { PureComponent } from 'react'

import Button from 'components/base/Button'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

type Props = {
  t: T,
}

class RetryButton extends PureComponent<Props> {
  render() {
    const { t, ...props } = this.props
    return <Button {...props}>{t('common.retry')}</Button>
  }
}

export default translate()(RetryButton)
