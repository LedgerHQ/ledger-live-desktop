// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import { urls } from 'config/urls'
import IconLoader from 'icons/Loader'

import ReleaseNotesButton from '../ReleaseNotesButton'
import AboutRowItem from '../AboutRowItem'

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
    const version = __APP_VERSION__

    return (
      <Section>
        <TrackPage category="Settings" name="About" />

        <Header
          icon={<IconLoader size={16} />}
          title={t('settings.tabs.about')}
          desc={t('settings.about.desc')}
        />

        <Body>
          <Row title={t('settings.help.version')} desc={`Ledger Live ${version}`}>
            <ReleaseNotesButton />
          </Row>

          <AboutRowItem
            title={t('settings.help.terms')}
            desc={t('settings.help.termsDesc')}
            url={urls.terms}
          />

          <AboutRowItem
            title={t('settings.help.privacy')}
            desc={t('settings.help.privacyDesc')}
            url={urls.privacyPolicy}
          />
        </Body>
      </Section>
    )
  }
}

export default translate()(SectionHelp)
