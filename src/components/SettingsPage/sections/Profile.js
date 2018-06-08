// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import bcrypt from 'bcryptjs'

import { cleanAccountsCache } from 'actions/accounts'
import { unlock } from 'reducers/application' // FIXME should be in actions
import db, { setEncryptionKey } from 'helpers/db'
import { delay } from 'helpers/promise'

import type { SettingsState } from 'reducers/settings'
import type { T } from 'types/common'

import CheckBox from 'components/base/CheckBox'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'
import IconUser from 'icons/User'
import PasswordModal from '../PasswordModal'
import DisablePasswordModal from '../DisablePasswordModal'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const mapDispatchToProps = {
  unlock,
  cleanAccountsCache,
}

type Props = {
  t: T,
  settings: SettingsState,
  unlock: Function,
  saveSettings: Function,
  cleanAccountsCache: () => *,
}

type State = {
  isHardResetModalOpened: boolean,
  isSoftResetModalOpened: boolean,
  isPasswordModalOpened: boolean,
  isDisablePasswordModalOpened: boolean,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    isHardResetModalOpened: false,
    isSoftResetModalOpened: false,
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

  handleOpenSoftResetModal = () => this.setState({ isSoftResetModalOpened: true })
  handleCloseSoftResetModal = () => this.setState({ isSoftResetModalOpened: false })
  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true })
  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false })
  handleOpenPasswordModal = () => this.setState({ isPasswordModalOpened: true })
  handleClosePasswordModal = () => this.setState({ isPasswordModalOpened: false })
  handleDisablePassowrd = () => this.setState({ isDisablePasswordModalOpened: true })
  handleCloseDisablePasswordModal = () => this.setState({ isDisablePasswordModalOpened: false })

  handleSoftReset = async () => {
    this.props.cleanAccountsCache()
    await delay(500)
    db.cleanCache()
    remote.getCurrentWindow().webContents.reload()
  }

  handleHardReset = async () => {
    db.resetAll()
    await delay(500)
    remote.getCurrentWindow().webContents.reload()
  }

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

  handleDeveloperMode = developerMode => {
    this.props.saveSettings({
      developerMode,
    })
  }

  render() {
    const { t, settings } = this.props
    const {
      isSoftResetModalOpened,
      isHardResetModalOpened,
      isPasswordModalOpened,
      isDisablePasswordModalOpened,
    } = this.state
    const isPasswordEnabled = settings.password.isEnabled === true
    return (
      <Section>
        <Header
          icon={<IconUser size={16} />}
          title={t('settings:tabs.profile')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row title={t('settings:profile.password')} desc={t('settings:profile.passwordDesc')}>
            <Box horizontal flow={2} align="center">
              {isPasswordEnabled && (
                <Button onClick={this.handleOpenPasswordModal}>
                  {t('settings:profile.changePassword')}
                </Button>
              )}
              <CheckBox isChecked={isPasswordEnabled} onChange={this.handleChangePasswordCheck} />
            </Box>
          </Row>
          <Row
            title={t('settings:profile.developerMode')}
            desc={t('settings:profile.developerModeDesc')}
          >
            <CheckBox isChecked={settings.developerMode} onChange={this.handleDeveloperMode} />
          </Row>
          <Row
            title={t('settings:profile.softResetTitle')}
            desc={t('settings:profile.softResetDesc')}
          >
            <Button primary onClick={this.handleOpenSoftResetModal}>
              {t('settings:profile.softReset')}
            </Button>
          </Row>
          <Row
            title={t('settings:profile.hardResetTitle')}
            desc={t('settings:profile.hardResetDesc')}
          >
            <Button danger onClick={this.handleOpenHardResetModal}>
              {t('settings:profile.hardReset')}
            </Button>
          </Row>
        </Body>

        <ConfirmModal
          isDanger
          isOpened={isSoftResetModalOpened}
          onClose={this.handleCloseSoftResetModal}
          onReject={this.handleCloseSoftResetModal}
          onConfirm={this.handleSoftReset}
          title={t('settings:softResetModal.title')}
          subTitle={t('settings:softResetModal.subTitle')}
          desc={t('settings:softResetModal.desc')}
        />

        <ConfirmModal
          isDanger
          isOpened={isHardResetModalOpened}
          onClose={this.handleCloseHardResetModal}
          onReject={this.handleCloseHardResetModal}
          onConfirm={this.handleHardReset}
          title={t('settings:hardResetModal.title')}
          subTitle={t('settings:hardResetModal.subTitle')}
          desc={t('settings:hardResetModal.desc')}
        />

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
      </Section>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(TabProfile)
