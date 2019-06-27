// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import db from 'helpers/db'
import { changePassword as changeLibcorePassword } from 'helpers/libcoreEncryption'
import { getLibcorePassword } from 'reducers/libcore'
import { hasPasswordSelector } from 'reducers/settings'
import { cleanAccountsCache } from 'actions/accounts'
import { setLibcorePassword } from 'actions/libcore'
import { saveSettings } from 'actions/settings'
import Track from 'analytics/Track'
import Switch from 'components/base/Switch'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import PasswordModal from './PasswordModal'
import DisablePasswordModal from './DisablePasswordModal'

const mapStateToProps = state => ({
  hasPassword: hasPasswordSelector(state),
  curentLibcorePassword: getLibcorePassword(state),
})

const mapDispatchToProps = {
  cleanAccountsCache,
  saveSettings,
  setLibcorePassword,
}

type Props = {
  t: T,
  saveSettings: Function,
  hasPassword: boolean,
  curentLibcorePassword: string,
  setLibcorePassword: Function,
}

type State = {
  isPasswordModalOpened: boolean,
  isDisablePasswordModalOpened: boolean,
}

class PasswordButton extends PureComponent<Props, State> {
  state = {
    isPasswordModalOpened: false,
    isDisablePasswordModalOpened: false,
  }

  setPassword = async password => {
    const { curentLibcorePassword, setLibcorePassword } = this.props

    if (password) {
      this.props.saveSettings({ hasPassword: true })
      await db.setEncryptionKey('app', 'accounts', password)
    } else {
      this.props.saveSettings({ hasPassword: false })
      await db.removeEncryptionKey('app', 'accounts')
    }

    const newLibcorePassword = password || ''

    await changeLibcorePassword(curentLibcorePassword, newLibcorePassword)
    await setLibcorePassword(newLibcorePassword)
  }

  handleOpenPasswordModal = () => this.setState({ isPasswordModalOpened: true })
  handleClosePasswordModal = () => this.setState({ isPasswordModalOpened: false })
  handleDisablePassword = () => this.setState({ isDisablePasswordModalOpened: true })
  handleCloseDisablePasswordModal = () => this.setState({ isDisablePasswordModalOpened: false })

  handleChangePasswordCheck = isChecked => {
    if (isChecked) {
      this.handleOpenPasswordModal()
    } else {
      this.handleDisablePassword()
    }
  }

  handleChangePassword = (password: ?string) => {
    if (password) {
      this.setPassword(password)
      this.handleClosePasswordModal()
    } else {
      this.setPassword(undefined)
      this.handleCloseDisablePasswordModal()
    }
  }

  render() {
    const { t, hasPassword } = this.props
    const { isDisablePasswordModalOpened, isPasswordModalOpened } = this.state

    return (
      <Fragment>
        <Track onUpdate event={hasPassword ? 'PasswordEnabled' : 'PasswordDisabled'} />

        <Box horizontal flow={2} align="center">
          {hasPassword && (
            <Button small onClick={this.handleOpenPasswordModal}>
              {t('settings.profile.changePassword')}
            </Button>
          )}
          <Switch
            isChecked={hasPassword}
            onChange={this.handleChangePasswordCheck}
            data-e2e="passwordLock_button"
          />
        </Box>

        <PasswordModal
          t={t}
          isOpened={isPasswordModalOpened}
          onClose={this.handleClosePasswordModal}
          onChangePassword={this.handleChangePassword}
          hasPassword={hasPassword}
        />

        <DisablePasswordModal
          t={t}
          isOpened={isDisablePasswordModalOpened}
          onClose={this.handleCloseDisablePasswordModal}
          onChangePassword={this.handleChangePassword}
          hasPassword={hasPassword}
        />
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PasswordButton),
)
