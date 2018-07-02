// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { createStructuredSelector } from 'reselect'
import bcrypt from 'bcryptjs'
import { setEncryptionKey } from 'helpers/db'
import { cleanAccountsCache } from 'actions/accounts'
import { saveSettings } from 'actions/settings'
import { storeSelector } from 'reducers/settings'
import type { SettingsState } from 'reducers/settings'
import { unlock } from 'reducers/application' // FIXME should be in actions
import Track from 'analytics/Track'
import Switch from 'components/base/Switch'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import PasswordModal from './PasswordModal'
import DisablePasswordModal from './DisablePasswordModal'

const mapStateToProps = createStructuredSelector({
  // FIXME in future we should use dedicated password selector and a savePassword action (you don't know the shape of settings)
  settings: storeSelector,
})

const mapDispatchToProps = {
  unlock,
  cleanAccountsCache,
  saveSettings,
}

type Props = {
  t: T,
  unlock: () => void,
  settings: SettingsState,
  saveSettings: Function,
}

type State = {
  isPasswordModalOpened: boolean,
  isDisablePasswordModalOpened: boolean,
}

class DisablePasswordButton extends PureComponent<Props, State> {
  state = {
    isPasswordModalOpened: false,
    isDisablePasswordModalOpened: false,
  }

  setPassword = password => {
    const { saveSettings, unlock } = this.props
    window.requestIdleCallback(() => {
      setEncryptionKey('accounts', password)
      const hash = password ? bcrypt.hashSync(password, 8) : undefined
      saveSettings({
        password: {
          isEnabled: hash !== undefined,
          value: hash,
        },
      })
      unlock()
    })
  }

  handleOpenPasswordModal = () => this.setState({ isPasswordModalOpened: true })
  handleClosePasswordModal = () => this.setState({ isPasswordModalOpened: false })
  handleDisablePassowrd = () => this.setState({ isDisablePasswordModalOpened: true })
  handleCloseDisablePasswordModal = () => this.setState({ isDisablePasswordModalOpened: false })

  handleChangePasswordCheck = isChecked => {
    if (isChecked) {
      this.handleOpenPasswordModal()
    } else {
      this.handleDisablePassowrd()
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
    const { t, settings } = this.props
    const { isDisablePasswordModalOpened, isPasswordModalOpened } = this.state
    const isPasswordEnabled = settings.password.isEnabled === true
    return (
      <Fragment>
        <Track onUpdate event={isPasswordEnabled ? 'PasswordEnabled' : 'PasswordDisabled'} />

        <Box horizontal flow={2} align="center">
          {isPasswordEnabled && (
            <Button small onClick={this.handleOpenPasswordModal}>
              {t('app:settings.profile.changePassword')}
            </Button>
          )}
          <Switch isChecked={isPasswordEnabled} onChange={this.handleChangePasswordCheck} />
        </Box>

        <PasswordModal
          t={t}
          isOpened={isPasswordModalOpened}
          onClose={this.handleClosePasswordModal}
          onChangePassword={this.handleChangePassword}
          isPasswordEnabled={isPasswordEnabled}
          currentPasswordHash={settings.password.value}
        />

        <DisablePasswordModal
          t={t}
          isOpened={isDisablePasswordModalOpened}
          onClose={this.handleCloseDisablePasswordModal}
          onChangePassword={this.handleChangePassword}
          isPasswordEnabled={isPasswordEnabled}
          currentPasswordHash={settings.password.value}
        />
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(DisablePasswordButton),
)
