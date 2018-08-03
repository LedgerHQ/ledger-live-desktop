// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import TrackPage from 'analytics/TrackPage'
import IconHelp from 'icons/Help'
import { resolveLogsDirectory } from 'helpers/log'
import { urls } from 'config/urls'

import ExportLogsBtn from 'components/ExportLogsBtn'
import OpenUserDataDirectoryBtn from 'components/OpenUserDataDirectoryBtn'
import CleanButton from '../CleanButton'
import ResetButton from '../ResetButton'
import AboutRowItem from '../AboutRowItem'
import LaunchOnboardingBtn from '../LaunchOnboardingBtn'
import CheckHealthButton from '../CheckHealthButton'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
}

class SectionHelp extends PureComponent<Props> {
  render() {
    const { t } = this.props

    return (
      <Section>
        <TrackPage category="Settings" name="Help" />

        <Header
          icon={<IconHelp size={16} />}
          title={t('app:settings.tabs.help')}
          desc={t('app:settings.help.desc')}
        />

        <Body>
          <AboutRowItem
            title={t('app:settings.help.faq')}
            desc={t('app:settings.help.faqDesc')}
            url={urls.faq}
          />
          <Row
            title={t('app:settings.profile.softResetTitle')}
            desc={t('app:settings.profile.softResetDesc')}
          >
            <CleanButton />
          </Row>
          <Row
            title={t('app:settings.exportLogs.title')}
            desc={t('app:settings.exportLogs.desc', { logsDirectory: resolveLogsDirectory() })}
          >
            <ExportLogsBtn />
          </Row>
          <Row
            title={t('app:settings.profile.launchOnboarding')}
            desc={t('app:settings.profile.launchOnboardingDesc')}
          >
            <LaunchOnboardingBtn />
          </Row>
          <Row
            title={t('app:settings.openUserDataDirectory.title')}
            desc={t('app:settings.openUserDataDirectory.desc')}
          >
            <OpenUserDataDirectoryBtn />
          </Row>
          <Row
            title={t('app:settings.profile.hardResetTitle')}
            desc={t('app:settings.profile.hardResetDesc')}
          >
            <ResetButton />
          </Row>
          <Row
            title={t('app:settings.healthCheck.title')}
            desc={t('app:settings.healthCheck.desc')}
          >
            <CheckHealthButton />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default translate()(SectionHelp)
