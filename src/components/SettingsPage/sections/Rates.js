// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import {
  currenciesSettingsSelector,
  counterValueExchangeSelector,
  counterValueCurrencySelector,
  intermediaryCurrency,
} from 'reducers/settings'
import { currenciesSelector } from 'reducers/accounts'
import Box from 'components/base/Box'
import type { Currency, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import IconDisplay from 'icons/Display'
import TrackPage from 'analytics/TrackPage'
import RateRow from '../RateRow'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRowContainer,
} from '../SettingsSection'

type Props = {
  t: T,
  currenciesSettings: *,
  currencies: CryptoCurrency[],
  counterValueCurrency: Currency,
  counterValueExchange: string,
}

class TabRates extends PureComponent<Props> {
  render() {
    const {
      t,
      currenciesSettings,
      currencies,
      counterValueExchange,
      counterValueCurrency,
    } = this.props

    return (
      <Section>
        <TrackPage category="Settings" name="Display" />
        <Header
          icon={<IconDisplay size={16} />}
          title={t('settings.tabs.rates')}
          desc={t('settings.rates.desc')}
        />
        <Body>
          {/*
          <Row
            title={t('settings.display.counterValue')}
            desc={t('settings.display.counterValueDesc')}
          >
            <CounterValueSelect />
          </Row>
          */}
          <SettingsSectionRowContainer>
            <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
              {'Rate'}
            </Box>
            <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
              {'Price'}
            </Box>
            <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
              {'Last 30 days'}
            </Box>
            <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
              {'Exchange'}
            </Box>
          </SettingsSectionRowContainer>
          <RateRow
            from={intermediaryCurrency}
            to={counterValueCurrency}
            exchangeId={counterValueExchange}
          />
          {currencies.filter(c => c !== intermediaryCurrency).map(from => {
            const cs = currenciesSettings[from.id]
            return (
              <RateRow
                key={from.id}
                from={from}
                to={intermediaryCurrency}
                exchangeId={cs && cs.exchange}
              />
            )
          })}
        </Body>
      </Section>
    )
  }
}

export default translate()(
  connect(
    createStructuredSelector({
      currenciesSettings: currenciesSettingsSelector,
      counterValueCurrency: counterValueCurrencySelector,
      counterValueExchange: counterValueExchangeSelector,
      currencies: currenciesSelector,
    }),
    null,
  )(TabRates),
)
