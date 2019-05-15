// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import TrackPage from 'analytics/TrackPage'
import IconHelp from 'icons/Help'
import { urls } from 'config/urls'

import ExportLogsBtn from 'components/ExportLogsBtn'
import OpenUserDataDirectoryBtn from 'components/OpenUserDataDirectoryBtn'
import CleanButton from '../CleanButton'
import ResetButton from '../ResetButton'
import RepairDeviceButton from '../RepairDeviceButton'
import AboutRowItem from '../AboutRowItem'
import LaunchOnboardingBtn from '../LaunchOnboardingBtn'

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
          title={t('settings.tabs.help')}
          desc={t('settings.help.desc')}
        />

        <Body>
          <AboutRowItem
            title={t('settings.help.faq')}
            desc={t('settings.help.faqDesc')}
            url={urls.faq}
          />
          <Row
            title={t('settings.profile.softResetTitle')}
            desc={t('settings.profile.softResetDesc')}
          >
            <CleanButton />
          </Row>
          <Row title={t('settings.exportLogs.title')} desc={t('settings.exportLogs.desc')}>
            <ExportLogsBtn />
          </Row>
          <Row
            title={t('settings.profile.launchOnboarding')}
            desc={t('settings.profile.launchOnboardingDesc')}
          >
            <LaunchOnboardingBtn />
          </Row>
          <Row
            title={t('settings.openUserDataDirectory.title')}
            desc={t('settings.openUserDataDirectory.desc')}
          >
            <OpenUserDataDirectoryBtn />
          </Row>
          <Row
            title={t('settings.profile.hardResetTitle')}
            desc={t('settings.profile.hardResetDesc')}
          >
            <ResetButton />
          </Row>
          <Row
            title={t('settings.repairDevice.title')}
            desc={t('settings.repairDevice.descSettings')}
          >
            <RepairDeviceButton buttonProps={{ small: true }} />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default translate()(SectionHelp)
