// @flow

import React, { PureComponent } from 'react'

import type { T } from 'types/common'

import IconCurrencies from 'icons/Currencies'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
}

class TabCurrencies extends PureComponent<Props> {
  render() {
    const { t } = this.props
    return (
      <Section>
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings:tabs.currencies')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row
            title={t('settings:currencies.confirmationsToSpend')}
            desc={t('settings:currencies.confirmationsToSpendDesc')}
          />
          <Row
            title={t('settings:currencies.confirmationsNb')}
            desc={t('settings:currencies.confirmationsNbDesc')}
          />
          <Row
            title={t('settings:currencies.transactionsFees')}
            desc={t('settings:currencies.transactionsFeesDesc')}
          />
          <Row
            title={t('settings:currencies.explorer')}
            desc={t('settings:currencies.explorerDesc')}
          />
        </Body>
      </Section>
    )
  }
}

export default TabCurrencies
