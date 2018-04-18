// @flow

import React, { PureComponent } from 'react'

import { listCurrencies } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies'
import type { Settings, CurrencySettings, T } from 'types/common'

import SelectCurrency from 'components/SelectCurrency'
import StepperNumber from 'components/base/StepperNumber'

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
  // will be overwritten
  coinType: 0,

  confirmationsToSpend: 10,
  minConfirmationsToSpend: 10,
  maxConfirmationsToSpend: 50,

  confirmationsNb: 10,
  minConfirmationsNb: 10,
  maxConfirmationsNb: 50,

  transactionFees: 10,
}

type Props = {
  settings: Settings,
  saveSettings: Function,
  t: T,
}

type State = {
  currency: Currency,
}

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: listCurrencies()[0],
  }

  getCurrencySettings() {
    const { settings } = this.props
    const { currency } = this.state
    return settings.currencies.find(c => c.coinType === currency.coinType)
  }

  handleChangeCurrency = (currency: Currency) => this.setState({ currency })

  handleChangeConfirmationsToSpend = (nb: number) =>
    this.updateCurrencySetting('confirmationsToSpend', nb)

  handleChangeConfirmationsNb = (nb: number) => this.updateCurrencySetting('confirmationsNb', nb)

  updateCurrencySetting = (key: string, val: number) => {
    const { settings, saveSettings } = this.props
    const { currency } = this.state
    const currencySettings = this.getCurrencySettings()
    let newCurrenciesSettings = []
    if (!currencySettings) {
      newCurrenciesSettings = [
        ...settings.currencies,
        {
          ...CURRENCY_DEFAULTS_SETTINGS,
          coinType: currency.coinType,
          [key]: val,
        },
      ]
    } else {
      newCurrenciesSettings = settings.currencies.map(c => {
        if (c.coinType !== currency.coinType) {
          return c
        }
        return { ...c, [key]: val }
      })
    }
    saveSettings({ currencies: newCurrenciesSettings })
  }

  render() {
    const { t } = this.props
    const { currency } = this.state
    const { confirmationsToSpend, confirmationsNb } =
      this.getCurrencySettings() || CURRENCY_DEFAULTS_SETTINGS
    return (
      <Section key={currency.coinType}>
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings:tabs.currencies')}
          desc="Lorem ipsum dolor sit amet"
          renderRight={
            <SelectCurrency
              style={{ minWidth: 200 }}
              small
              value={currency}
              onChange={this.handleChangeCurrency}
            />
          }
        />
        <Body>
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

export default TabCurrencies
