// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import {
  hasPasswordSelector,
  langAndRegionSelector,
  counterValueCurrencySelector,
} from 'reducers/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { EXPERIMENTAL_MARKET_INDICATOR_SETTINGS } from 'config/constants'

import IconDisplay from 'icons/Display'
import TrackPage from 'analytics/TrackPage'
import MarketIndicatorRadio from '../MarketIndicatorRadio'
import LanguageSelect from '../LanguageSelect'
import CounterValueSelect from '../CounterValueSelect'
import CounterValueExchangeSelect from '../CounterValueExchangeSelect'
import RegionSelect from '../RegionSelect'
import PasswordButton from '../PasswordButton'
import PasswordAutoLockSelect from '../PasswordAutoLockSelect'
import DevModeButton from '../DevModeButton'
import SentryLogsButton from '../SentryLogsButton'
import ShareAnalyticsButton from '../ShareAnalyticsButton'

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
  hasPassword: boolean,
}

class TabGeneral extends PureComponent<Props> {
  render() {
    const { t, useSystem, counterValueCurrency, hasPassword } = this.props

    return (
      <Section>
        <TrackPage category="Settings" name="Display" />
        <Header
          icon={<IconDisplay size={16} />}
          title={t('settings.tabs.display')}
          desc={t('settings.display.desc')}
        />
        <Body>
          <Row
            title={t('settings.display.counterValue')}
            desc={t('settings.display.counterValueDesc')}
          >
            <CounterValueSelect />
          </Row>
          <Row
            title={t('settings.display.exchange', {
              ticker: counterValueCurrency.ticker,
              fiat: counterValueCurrency.name,
            })}
            desc={t('settings.display.exchangeDesc', {
              fiat: counterValueCurrency.name,
              ticker: counterValueCurrency.ticker,
            })}
          >
            <CounterValueExchangeSelect />
          </Row>
          <Row title={t('settings.display.language')} desc={t('settings.display.languageDesc')}>
            <LanguageSelect />
          </Row>
          {useSystem ? null : (
            <Row title={t('settings.display.region')} desc={t('settings.display.regionDesc')}>
              <RegionSelect />
            </Row>
          )}

          {EXPERIMENTAL_MARKET_INDICATOR_SETTINGS ? (
            <Row title={t('settings.display.stock')} desc={t('settings.display.stockDesc')}>
              <MarketIndicatorRadio />
            </Row>
          ) : null}

          <Row title={t('settings.profile.password')} desc={t('settings.profile.passwordDesc')}>
            <PasswordButton />
          </Row>
          {hasPassword ? (
            <Row
              title={t('settings.profile.passwordAutoLock')}
              desc={t('settings.profile.passwordAutoLockDesc')}
            >
              <PasswordAutoLockSelect />
            </Row>
          ) : null}
          <Row
            title={t('settings.profile.reportErrors')}
            desc={t('settings.profile.reportErrorsDesc')}
          >
            <SentryLogsButton />
          </Row>
          <Row title={t('settings.profile.analytics')} desc={t('settings.profile.analyticsDesc')}>
            <ShareAnalyticsButton />
          </Row>
          <Row
            title={t('settings.profile.developerMode')}
            desc={t('settings.profile.developerModeDesc')}
          >
            <DevModeButton />
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
      hasPasswordSelector,
      ({ useSystem }, counterValueCurrency, hasPassword) => ({
        useSystem,
        counterValueCurrency,
        hasPassword,
      }),
    ),
    null,
  )(TabGeneral),
)
