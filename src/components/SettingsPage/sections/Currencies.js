// @flow

// TODO refactoring:
// this component shouldn't accept the full settings object, actually it needs to be connected to nothing,
// it doesn't need saveSettings nor settings, instead, it just need to track selected Currency and delegate to 2 new components:
// - a new ConnectedSelectCurrency , that filters only the currency that comes from accounts (use the existing selector)
// - a new CurrencySettings component, that receives currency & will connect to the store to grab the relevant settings as well as everything it needs (counterValueCurrency), it also takes a saveCurrencySettings action (create if not existing)

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import { intermediaryCurrency, currencySettingsLocaleSelector } from 'reducers/settings'
import type { SettingsState } from 'reducers/settings'
import { currenciesSelector } from 'reducers/accounts'
import { currencySettingsDefaults } from 'helpers/SettingsDefaults'

import SelectCurrency from 'components/SelectCurrency'
import StepperNumber from 'components/base/StepperNumber'
import ExchangeSelect from 'components/SelectExchange'

import IconCurrencies from 'icons/Currencies'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  currencies: CryptoCurrency[],
  settings: SettingsState,
  saveSettings: ($Shape<SettingsState>) => void,
  t: T,
}

type State = {
  currency: CryptoCurrency,
}

const mapStateToProps = createStructuredSelector({
  currencies: currenciesSelector,
})

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: this.props.currencies[0],
  }

  handleChangeCurrency = (currency: CryptoCurrency) => this.setState({ currency })

  handleChangeConfirmationsToSpend = (nb: number) =>
    this.updateCurrencySettings('confirmationsToSpend', nb)

  handleChangeConfirmationsNb = (nb: number) => this.updateCurrencySettings('confirmationsNb', nb)

  handleChangeExchange = exchange =>
    this.updateCurrencySettings('exchange', exchange ? exchange.id : null)

  updateCurrencySettings = (key: string, val: *) => {
    // FIXME this really should be a dedicated action
    const { settings, saveSettings } = this.props
    const { currency } = this.state
    const currencySettings = settings.currenciesSettings[currency.id]
    let newCurrenciesSettings = []
    if (!currencySettings) {
      newCurrenciesSettings = {
        ...settings.currenciesSettings,
        [currency.id]: {
          [key]: val,
        },
      }
    } else {
      newCurrenciesSettings = {
        ...settings.currenciesSettings,
        [currency.id]: {
          ...currencySettings,
          [key]: val,
        },
      }
    }
    saveSettings({ currenciesSettings: newCurrenciesSettings })
  }

  render() {
    const { currency } = this.state
    if (!currency) return null // this case means there is no accounts
    const { t, currencies, settings } = this.props
    const { confirmationsNb, exchange } = currencySettingsLocaleSelector(settings, currency)
    const defaults = currencySettingsDefaults(currency)
    return (
      <Section key={currency.id}>
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings:tabs.currencies')}
          desc="Lorem ipsum dolor sit amet"
          renderRight={
            // TODO this should only be the subset of currencies of the app
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
          {currency !== intermediaryCurrency ? (
            <Row
              title={`Exchange (${currency.ticker}${intermediaryCurrency.ticker})`}
              desc="The exchange to use"
            >
              <ExchangeSelect
                small
                from={currency}
                to={intermediaryCurrency}
                exchangeId={exchange}
                onChange={this.handleChangeExchange}
                minWidth={200}
              />
            </Row>
          ) : null}
          {defaults.confirmationsNb ? (
            <Row
              title={t('settings:currencies.confirmationsNb')}
              desc={t('settings:currencies.confirmationsNbDesc')}
            >
              <StepperNumber
                min={defaults.confirmationsNb.min}
                max={defaults.confirmationsNb.max}
                step={1}
                onChange={this.handleChangeConfirmationsNb}
                value={confirmationsNb}
              />
            </Row>
          ) : null}
        </Body>
      </Section>
    )
  }
}

// $FlowFixMe not sure what's wrong
export default connect(mapStateToProps)(TabCurrencies)
