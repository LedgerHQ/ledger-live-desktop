// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { cryptoCurrenciesSelector } from 'reducers/accounts'
import IconCurrencies from 'icons/Currencies'
import TrackPage from 'analytics/TrackPage'
import SelectCurrency from 'components/SelectCurrency'
import CurrencyRows from './CurrencyRows'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
} from '../SettingsSection'

type Props = {
  currencies: CryptoCurrency[],
  t: T,
}

type State = {
  currency: CryptoCurrency,
}

const mapStateToProps = createStructuredSelector({
  currencies: cryptoCurrenciesSelector,
})

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: this.props.currencies[0],
  }

  handleChangeCurrency = (currency: CryptoCurrency) => this.setState({ currency })

  render() {
    const { currency } = this.state
    if (!currency) return null // this case means there is no accounts
    const { t, currencies } = this.props
    return (
      <Section key={currency.id}>
        <TrackPage category="Settings" name="Currencies" currencyId={currency.id} />
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings.tabs.currencies')}
          desc={t('settings.currencies.desc')}
          renderRight={
            <SelectCurrency
              small
              minWidth={200}
              value={currency}
              onChange={this.handleChangeCurrency}
              currencies={currencies}
            />
          }
        />
        <Body>
          <CurrencyRows currency={currency} />
        </Body>
      </Section>
    )
  }
}

export default translate()(connect(mapStateToProps)(TabCurrencies))
