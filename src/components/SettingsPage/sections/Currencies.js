// @flow

import React, { PureComponent } from 'react'

import { listCurrencies } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies'
import type { T } from 'types/common'

import SelectCurrency from 'components/SelectCurrency'

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

type State = {
  currency: Currency,
}

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: listCurrencies()[0],
  }

  handleChangeCurrency = (currency: Currency) => this.setState({ currency })

  render() {
    const { t } = this.props
    const { currency } = this.state
    return (
      <Section>
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings:tabs.currencies')}
          desc="Lorem ipsum dolor sit amet"
          renderRight={
            <SelectCurrency small value={currency} onChange={this.handleChangeCurrency} />
          }
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
