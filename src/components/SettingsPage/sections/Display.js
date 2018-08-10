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

          {EXPERIMENTAL_MARKET_INDICATOR_SETTINGS ? (
            <Row title={t('app:settings.display.stock')} desc={t('app:settings.display.stockDesc')}>
              <MarketIndicatorRadio />
            </Row>
          ) : null}

          <Row
            title={t('app:settings.profile.password')}
            desc={t('app:settings.profile.passwordDesc')}
          >
            <PasswordButton />
          </Row>
          {hasPassword ? (
            <Row
              title={t('app:settings.profile.passwordAutoLock')}
              desc={t('app:settings.profile.passwordAutoLockDesc')}
            >
              <PasswordAutoLockSelect />
            </Row>
          ) : null}
          <Row
            title={t('app:settings.profile.reportErrors')}
            desc={t('app:settings.profile.reportErrorsDesc')}
          >
            <SentryLogsButton />
          </Row>
          <Row
            title={t('app:settings.profile.analytics')}
            desc={t('app:settings.profile.analyticsDesc')}
          >
            <ShareAnalyticsButton />
          </Row>
          <Row
            title={t('app:settings.profile.developerMode')}
            desc={t('app:settings.profile.developerModeDesc')}
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
