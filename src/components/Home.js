// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

type Props = {
  devices: Array<Object>,
  t: string => string,
}

class Home extends PureComponent<Props> {
  render() {
    const { devices, t } = this.props
    return (
      <div>
        {t('common.cancel')}
        {devices.map(device => device.path)}
      </div>
    )
  }
}

export default compose(connect(({ devices }: Props): Object => ({ devices })), translate())(Home)
