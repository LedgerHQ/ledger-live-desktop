// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

// import type { Settings, T } from 'types/common'
import type { T } from 'types/common'

import { unlock } from 'reducers/application'

import IconUser from 'icons/User'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
  // settings: Settings,
  // onSaveSettings: Function,
  // unlock: Function,
}

type State = {}

const mapDispatchToProps = {
  unlock,
}

class TabProfile extends PureComponent<Props, State> {
  state = {}

  render() {
    const { t } = this.props

    return (
      <Section>
        <Header
          icon={<IconUser size={16} />}
          title={t('settings:tabs.profile')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row title={t('settings:display.language')} desc={t('settings:display.languageDesc')}>
            noetuhnoeth
          </Row>
        </Body>
      </Section>
    )
  }
}

export default connect(null, mapDispatchToProps)(TabProfile)
