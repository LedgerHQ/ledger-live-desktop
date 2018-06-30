// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { langAndRegionSelector, counterValueCurrencySelector } from 'reducers/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import IconDisplay from 'icons/Display'
import TrackPage from 'analytics/TrackPage'
import MarketIndicatorRadio from '../MarketIndicatorRadio'
import LanguageSelect from '../LanguageSelect'
import CounterValueSelect from '../CounterValueSelect'
import CounterValueExchangeSelect from '../CounterValueExchangeSelect'
import RegionSelect from '../RegionSelect'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
  counterValueCurrency: Currency,
  useSystem: boolean,
}

class TabGeneral extends PureComponent<Props> {
  render() {
    const { t, useSystem, counterValueCurrency } = this.props

    return (
      <Section>
        <TrackPage category="Settings" name="Display" />
        <Header
          icon={<IconDisplay size={16} />}
          title={t('app:settings.tabs.display')}
          desc={t('app:settings.display.desc')}
        />
        <Body>
          <Row
            title={t('app:settings.display.counterValue')}
            desc={t('app:settings.display.counterValueDesc')}
          >
            <CounterValueSelect />
          </Row>
          <Row
            title={t('app:settings.display.exchange', {
              ticker: counterValueCurrency.ticker,
              fiat: counterValueCurrency.name,
            })}
            desc={t('app:settings.display.exchangeDesc', {
              fiat: counterValueCurrency.name,
              ticker: counterValueCurrency.ticker,
            })}
          >
            <CounterValueExchangeSelect />
          </Row>
          <Row
            title={t('app:settings.display.language')}
            desc={t('app:settings.display.languageDesc')}
          >
            <LanguageSelect />
          </Row>
          {useSystem ? null : (
            <Row
              title={t('app:settings.display.region')}
              desc={t('app:settings.display.regionDesc')}
            >
              <RegionSelect />
            </Row>
          )}
          <Row title={t('app:settings.display.stock')} desc={t('app:settings.display.stockDesc')}>
            <MarketIndicatorRadio />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default translate()(
  connect(
    createSelector(
      langAndRegionSelector,
      counterValueCurrencySelector,
      ({ useSystem }, counterValueCurrency) => ({
        useSystem,
        counterValueCurrency,
      }),
    ),
  )(TabGeneral),
)
