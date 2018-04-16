// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { Settings, T } from 'types/common'

import { unlock } from 'reducers/application'

import Input from 'components/base/Input'
import IconUser from 'icons/User'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  // unlock: Function,
}

type State = {}

const mapStateToProps = state => ({
  username: state.settings,
})

const mapDispatchToProps = {
  unlock,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    username: this.props.settings.username,
  }

  handleChangeUsername = username => {
    const { saveSettings } = this.props
    this.setState({ username })
    window.requestIdleCallback(() => {
      saveSettings({ username: username.trim() || 'Anonymous' })
    })
  }

  render() {
    const { t } = this.props
    const { username } = this.state

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
            {'-'}
          </Row>
          <Row title={t('settings:profile.export')} desc={t('settings:profile.exportDesc')}>
            {'-'}
          </Row>
          <Row title={t('settings:profile.reset')} desc={t('settings:profile.resetDesc')}>
            {'-'}
          </Row>
        </Body>
      </Section>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabProfile)
