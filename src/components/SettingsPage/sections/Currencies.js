// @flow

// TODO refactoring:
// this component shouldn't accept the full settings object, actually it needs to be connected to nothing,
// it doesn't need saveSettings nor settings, instead, it just need to track selected Currency and delegate to 2 new components:
// - a new ConnectedSelectCurrency , that filters only the currency that comes from accounts (use the existing selector)
// - a new CurrencySettings component, that receives currency & will connect to the store to grab the relevant settings as well as everything it needs (counterValueCurrency), it also takes a saveCurrencySettings action (create if not existing)

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import type { CryptoCurrency, Currency } from '@ledgerhq/live-common/lib/types'
import type { Settings, CurrencySettings, T } from 'types/common'

import { counterValueCurrencySelector } from 'reducers/settings'
import { currenciesSelector } from 'reducers/accounts'
import CounterValues from 'helpers/countervalues'

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

//  .
// /!\ Please note that this will likely not be like that in the future.
//     I guess that all currencies should have those settings inside them
//     instead of using same default for all.
//
const CURRENCY_DEFAULTS_SETTINGS: CurrencySettings = {
  confirmationsToSpend: 10,
  minConfirmationsToSpend: 10,
  maxConfirmationsToSpend: 50,

  confirmationsNb: 10,
  minConfirmationsNb: 10,
  maxConfirmationsNb: 50,

  transactionFees: 10,

  exchange: '',
}

type Props = {
  counterValueCurrency: Currency,
  currencies: CryptoCurrency[],
  settings: Settings,
  saveSettings: Function,
  t: T,
}

type State = {
  currency: CryptoCurrency,
}

const mapStateToProps = createStructuredSelector({
  counterValueCurrency: counterValueCurrencySelector,
  currencies: currenciesSelector,
})

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: this.props.currencies[0],
  }

  getCurrencySettings() {
    const { settings } = this.props
    const { currency } = this.state
    return settings.currenciesSettings[currency.id]
  }

  handleChangeCurrency = (currency: CryptoCurrency) => this.setState({ currency })

  handleChangeConfirmationsToSpend = (nb: number) =>
    this.updateCurrencySettings('confirmationsToSpend', nb)

  handleChangeConfirmationsNb = (nb: number) => this.updateCurrencySettings('confirmationsNb', nb)

  handleChangeExchange = exchange =>
    this.updateCurrencySettings('exchange', exchange ? exchange.id : '')

  updateCurrencySettings = (key: string, val: *) => {
    // FIXME this really should be a dedicated action
    const { settings, saveSettings } = this.props
    const { currency } = this.state
    const currencySettings = this.getCurrencySettings()
    let newCurrenciesSettings = []
    if (!currencySettings) {
      newCurrenciesSettings = {
        ...settings.currenciesSettings,
        [currency.id]: {
          ...CURRENCY_DEFAULTS_SETTINGS,
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
    const { t, currencies, counterValueCurrency } = this.props
    const { confirmationsToSpend, confirmationsNb, exchange } =
      this.getCurrencySettings() || CURRENCY_DEFAULTS_SETTINGS
    return (
      <Section key={currency.id}>
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings:tabs.currencies')}
          desc="Lorem ipsum dolor sit amet"
          renderRight={
            // TODO this should only be the subset of currencies of the app
            <SelectCurrency
              style={{ minWidth: 200 }}
              small
              value={currency}
              onChange={this.handleChangeCurrency}
              currencies={currencies}
            />
          }
        />
        <Body>
          <Row title="Exchange" desc="The exchange to use">
            <CounterValues.PollingConsumer>
              {polling => (
                // TODO move to a dedicated "row" component
                <ExchangeSelect
                  from={currency}
                  to={counterValueCurrency}
                  exchangeId={exchange}
                  onChange={exchange => {
                    this.handleChangeExchange(exchange)
                    polling.poll()
                  }}
                  style={{ minWidth: 200 }}
                />
              )}
            </CounterValues.PollingConsumer>
          </Row>
          <Row
            title={t('settings:currencies.confirmationsToSpend')}
            desc={t('settings:currencies.confirmationsToSpendDesc')}
          >
            <StepperNumber
              min={10}
              max={40}
              step={1}
              onChange={this.handleChangeConfirmationsToSpend}
              value={confirmationsToSpend}
            />
          </Row>
          <Row
            title={t('settings:currencies.confirmationsNb')}
            desc={t('settings:currencies.confirmationsNbDesc')}
          >
            <StepperNumber
              min={10}
              max={40}
              step={1}
              onChange={this.handleChangeConfirmationsNb}
              value={confirmationsNb}
            />
          </Row>
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

// $FlowFixMe not sure what's wrong
export default connect(mapStateToProps)(TabCurrencies)
