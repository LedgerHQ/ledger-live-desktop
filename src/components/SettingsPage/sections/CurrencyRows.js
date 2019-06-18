// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { saveSettings } from 'actions/settings'
import { intermediaryCurrency, currencySettingsSelector, storeSelector } from 'reducers/settings'
import type { SettingsState, CurrencySettings } from 'reducers/settings'
import { currencySettingsDefaults } from 'helpers/SettingsDefaults'
import StepperNumber from 'components/base/StepperNumber'
import ExchangeSelect from 'components/SelectExchange'
import Track from 'analytics/Track'

import { SettingsSectionRow as Row } from '../SettingsSection'

type Props = {
  t: T,
  currency: CryptoCurrency,
  currencySettings: CurrencySettings,
  // FIXME: the stuff bellow to be to be gone!
  settings: SettingsState,
  saveSettings: ($Shape<SettingsState>) => void,
}

class CurrencyRows extends PureComponent<Props> {
  handleChangeConfirmationsNb = (nb: number) => this.updateCurrencySettings('confirmationsNb', nb)

  handleChangeExchange = (exchange: *) =>
    this.updateCurrencySettings('exchange', exchange ? exchange.id : null)

  updateCurrencySettings = (key: string, val: *) => {
    // FIXME this really should be a dedicated action
    const { settings, saveSettings, currency } = this.props
    const currencySettings = settings.currenciesSettings[currency.ticker]
    let newCurrenciesSettings = []
    if (!currencySettings) {
      newCurrenciesSettings = {
        ...settings.currenciesSettings,
        [currency.ticker]: {
          [key]: val,
        },
      }
    } else {
      newCurrenciesSettings = {
        ...settings.currenciesSettings,
        [currency.ticker]: {
          ...currencySettings,
          [key]: val,
        },
      }
    }
    saveSettings({ currenciesSettings: newCurrenciesSettings })
  }

  render() {
    const { currency, t, settings, currencySettings } = this.props
    const { confirmationsNb, exchange } = currencySettings
    const defaults = currencySettingsDefaults(currency)
    return (
      <Fragment>
        {currency !== intermediaryCurrency ? (
          <Row
            title={t('settings.currencies.exchange', {
              ticker: currency.ticker,
            })}
            desc={t('settings.currencies.exchangeDesc', {
              ticker: currency.ticker,
              fiat: settings.counterValue,
            })}
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
            title={t('settings.currencies.confirmationsNb')}
            desc={t('settings.currencies.confirmationsNbDesc')}
          >
            <Track onUpdate event="ConfirmationsNb" confirmationsNb={confirmationsNb} />
            <StepperNumber
              min={defaults.confirmationsNb.min}
              max={defaults.confirmationsNb.max}
              step={1}
              onChange={this.handleChangeConfirmationsNb}
              value={confirmationsNb}
            />
          </Row>
        ) : null}
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    createStructuredSelector({
      currencySettings: currencySettingsSelector,
      settings: storeSelector,
    }),
    {
      saveSettings,
    },
  )(CurrencyRows),
)
