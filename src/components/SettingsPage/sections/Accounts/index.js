// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import SectionExport from './Export'
import { SettingsSection as Section, SettingsSectionHeader as Header } from '../../SettingsSection'
import EyeSlash from '../../../../icons/EyeSlash'
import HideEmptyTokenAccountsToggle from '../../HideEmptyTokenAccountsToggle'

type Props = {
  t: T,
}

class SectionAccounts extends PureComponent<Props> {
  render() {
    const { t } = this.props

    return (
      <Section style={{ flowDirection: 'column' }}>
        <TrackPage category="Settings" name="Accounts" />

        <Header
          icon={<EyeSlash />}
          title={t('settings.accounts.hideEmptyTokens.title')}
          desc={t('settings.accounts.hideEmptyTokens.desc')}
          renderRight={<HideEmptyTokenAccountsToggle />}
        />

        <SectionExport />
      </Section>
    )
  }
}

export default translate()(SectionAccounts)
