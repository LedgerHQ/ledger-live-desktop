// @flow

import React, { PureComponent } from 'react'
import { MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import Modal from 'components/base/Modal'
import AccountSettingRenderBody from './AccountSettingRenderBody'

export default class SettingsAccount extends PureComponent<*, *> {
  render() {
    return (
      <Modal
        name={MODAL_SETTINGS_ACCOUNT}
        render={({ data, onClose }) => <AccountSettingRenderBody data={data} onClose={onClose} />}
      />
    )
  }
}
