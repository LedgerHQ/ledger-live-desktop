// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'
import bcrypt from 'bcryptjs'

import type { Settings, T } from 'types/common'

import debounce from 'lodash/debounce'

import { unlock } from 'reducers/application'
import db, { setEncryptionKey } from 'helpers/db'

import Input from 'components/base/Input'
import CheckBox from 'components/base/CheckBox'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'
import IconUser from 'icons/User'
import PasswordModal from '../PasswordModal'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const mapDispatchToProps = {
  unlock,
}

type Props = {
  t: T,
  settings: Settings,
  unlock: Function,
  saveSettings: Function,
}

type State = {
  isHardResetModalOpened: boolean,
  isPasswordModalOpened: boolean,
  username: string,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    username: this.props.settings.username,
    isHardResetModalOpened: false,
    isPasswordModalOpened: false,
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

  debounceSaveUsername = debounce(
    v => this.props.saveSettings({ username: v.trim() || 'Anonymous' }),
    250,
  )

  handleChangeUsername = username => {
    this.setState({ username })
    this.debounceSaveUsername(username)
  }

  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true })
  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false })
  handleOpenPasswordModal = () => this.setState({ isPasswordModalOpened: true })
  handleClosePasswordModal = () => this.setState({ isPasswordModalOpened: false })

  handleHardReset = () => {
    db.resetAll()
    remote.app.relaunch()
    remote.app.exit()
  }

  handleChangePasswordCheck = isChecked => {
    if (isChecked) {
      this.handleOpenPasswordModal()
    } else {
      this.setPassword(undefined)
    }
  }

  handleChangePassword = (password: ?string) => {
    if (password) {
      this.setPassword(password)
      this.handleClosePasswordModal()
    }
  }

  render() {
    const { t, settings } = this.props
    const { username, isHardResetModalOpened, isPasswordModalOpened } = this.state
    const isPasswordEnabled = settings.password.isEnabled === true
    return (
      <Section>
        <Header
          icon={<IconUser size={16} />}
          title={t('settings:tabs.profile')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row title={t('settings:profile.username')} desc={t('settings:profile.usernameDesc')}>
            <Input
              small
              placeholder={t('settings:profile.username')}
              onChange={this.handleChangeUsername}
              value={username}
            />
          </Row>
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
          <Row title={t('settings:profile.sync')} desc={t('settings:profile.syncDesc')}>
            <Button primary>{t('settings:profile.sync')}</Button>
          </Row>
          <Row title={t('settings:profile.export')} desc={t('settings:profile.exportDesc')}>
            <Button primary>{t('settings:profile.export')}</Button>
          </Row>
          <Row title={t('settings:profile.reset')} desc={t('settings:profile.resetDesc')}>
            <Button danger onClick={this.handleOpenHardResetModal}>
              {t('settings:profile.resetButton')}
            </Button>
          </Row>
        </Body>

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
      </Section>
    )
  }
}

export default connect(null, mapDispatchToProps)(TabProfile)
