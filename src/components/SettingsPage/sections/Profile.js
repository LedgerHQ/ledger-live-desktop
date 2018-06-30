// @flow
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import ExportLogsBtn from 'components/ExportLogsBtn'
import IconUser from 'icons/User'
import DisablePasswordButton from '../DisablePasswordButton'
import DevModeButton from '../DevModeButton'
import SentryLogsButton from '../SentryLogsButton'
import ShareAnalyticsButton from '../ShareAnalyticsButton'
import CleanButton from '../CleanButton'
import ResetButton from '../ResetButton'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
}

class TabProfile extends Component<Props> {
  render() {
    const { t } = this.props
    return (
      <Section>
        <TrackPage category="Settings" name="Profile" />
        <Header
          icon={<IconUser size={16} />}
          title={t('app:settings.tabs.profile')}
          desc={t('app:settings.display.desc')}
        />
        <Body>
          <Row
            title={t('app:settings.profile.password')}
            desc={t('app:settings.profile.passwordDesc')}
          >
            <DisablePasswordButton />
          </Row>
          <Row
            title={t('app:settings.profile.reportErrors')}
            desc={t('app:settings.profile.reportErrorsDesc')}
          >
            <SentryLogsButton />
          </Row>
          <Row
            title={t('app:settings.profile.analytics')}
            desc={t('app:settings.profile.analyticsDesc')}
          >
            <ShareAnalyticsButton />
          </Row>
          <Row
            title={t('app:settings.profile.developerMode')}
            desc={t('app:settings.profile.developerModeDesc')}
          >
            <DevModeButton />
          </Row>
          <Row
            title={t('app:settings.profile.softResetTitle')}
            desc={t('app:settings.profile.softResetDesc')}
          >
            <CleanButton />
          </Row>
          <Row title={t('app:settings.exportLogs.title')} desc={t('app:settings.exportLogs.desc')}>
            <ExportLogsBtn />
          </Row>
          <Row
            title={t('app:settings.profile.hardResetTitle')}
            desc={t('app:settings.profile.hardResetDesc')}
          >
            <ResetButton />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default translate()(TabProfile)
