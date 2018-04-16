// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { remote } from 'electron'

import type { Settings, T } from 'types/common'

import { unlock } from 'reducers/application'
import db from 'helpers/db'

import Input from 'components/base/Input'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'
import IconUser from 'icons/User'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const mapStateToProps = state => ({
  username: state.settings,
})

const mapDispatchToProps = {
  unlock,
}

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  // unlock: Function,
}

type State = {
  isHardResetModalOpened: boolean,
  username: string,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    username: this.props.settings.username,
    isHardResetModalOpened: false,
  }

  handleChangeUsername = username => {
    const { saveSettings } = this.props
    this.setState({ username })
    window.requestIdleCallback(() => {
      saveSettings({ username: username.trim() || 'Anonymous' })
    })
  }

  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true })
  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false })

  handleHardReset = () => {
    db.resetAll()
    remote.app.relaunch()
    remote.app.exit()
  }

  render() {
    const { t } = this.props
    const { username, isHardResetModalOpened } = this.state

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
            {'-'}
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
      </Section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabProfile)
