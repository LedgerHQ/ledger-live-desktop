// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import { listFiatCurrencies } from '@ledgerhq/live-common/lib/helpers/currencies'

import {
  intermediaryCurrency,
  counterValueCurrencyLocalSelector,
  counterValueExchangeLocalSelector,
} from 'reducers/settings'

import type { SettingsState as Settings } from 'reducers/settings'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import SelectExchange from 'components/SelectExchange'
import Select from 'components/base/Select'
import RadioGroup from 'components/base/RadioGroup'
import IconDisplay from 'icons/Display'
import languageKeys from 'config/languages'

import regionsByKey from 'helpers/regions.json'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const regions = Object.keys(regionsByKey).map(key => {
  const [language, region] = key.split('-')
  return { value: key, language, region, label: regionsByKey[key] }
})

const fiats = listFiatCurrencies()
  .map(f => f.units[0])
  // For now we take first unit, in the future we'll need to figure out something else
  .map(fiat => ({
    value: fiat.code,
    label: `${fiat.name} - ${fiat.code}${fiat.symbol ? ` (${fiat.symbol})` : ''}`,
    fiat,
  }))

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  i18n: Object,
}

type State = {
  cachedMarketIndicator: string,
  cachedLanguageKey: string,
  cachedCounterValue: ?Object,
  cachedRegion: string,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    cachedMarketIndicator: this.props.settings.marketIndicator,
    cachedLanguageKey: this.props.settings.language,
    cachedCounterValue: fiats.find(fiat => fiat.fiat.code === this.props.settings.counterValue),
    cachedRegion: this.props.settings.region,
  }

  getMarketIndicators() {
    const { t } = this.props
    return [
      {
        label: t('app:common.eastern'),
        key: 'eastern',
      },
      {
        label: t('app:common.western'),
        key: 'western',
      },
    ]
  }

  handleChangeCounterValue = (item: Object) => {
    const { saveSettings } = this.props
    this.setState({ cachedCounterValue: item.fiat })
    window.requestIdleCallback(() => {
      saveSettings({ counterValue: item.fiat.code })
    })
  }

  handleChangeLanguage = ({ value: languageKey }: *) => {
    const { i18n, saveSettings } = this.props
    this.setState({ cachedLanguageKey: languageKey })
    window.requestIdleCallback(() => {
      i18n.changeLanguage(languageKey)
      moment.locale(languageKey)
      saveSettings({ language: languageKey })
    })
  }

  handleChangeRegion = ({ region }: *) => {
    const { saveSettings } = this.props
    this.setState({ cachedRegion: region })
    window.requestIdleCallback(() => {
      saveSettings({ region })
    })
  }

  handleChangeMarketIndicator = (item: Object) => {
    const { saveSettings } = this.props
    const marketIndicator = item.key
    this.setState({
      cachedMarketIndicator: marketIndicator,
    })
    window.requestIdleCallback(() => {
      saveSettings({ marketIndicator })
    })
  }

  handleChangeExchange = (exchange: *) =>
    this.props.saveSettings({ counterValueExchange: exchange ? exchange.id : null })

  render() {
    const { t, settings } = this.props
    const {
      cachedMarketIndicator,
      cachedLanguageKey,
      cachedCounterValue,
      cachedRegion,
    } = this.state

    const counterValueCurrency = counterValueCurrencyLocalSelector(settings)
    const counterValueExchange = counterValueExchangeLocalSelector(settings)

    const languages = languageKeys.map(key => ({ value: key, label: t(`language:${key}`) }))
    const currentLanguage = languages.find(l => l.value === cachedLanguageKey)
    const regionsFiltered = regions.filter(({ language }) => cachedLanguageKey === language)
    const currentRegion =
      regionsFiltered.find(({ region }) => cachedRegion === region) || regionsFiltered[0]

    const cvOption = cachedCounterValue
      ? fiats.find(f => f.value === cachedCounterValue.value)
      : null

    return (
      <Section>
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
            <Box horizontal flow={2}>
              <Select
                small
                minWidth={250}
                onChange={this.handleChangeCounterValue}
                itemToString={item => (item ? item.name : '')}
                renderSelected={item => item && item.name}
                options={fiats}
                value={cvOption}
              />
              <SelectExchange
                small
                from={intermediaryCurrency}
                to={counterValueCurrency}
                exchangeId={counterValueExchange}
                onChange={this.handleChangeExchange}
                minWidth={150}
              />
            </Box>
          </Row>
          <Row
            title={t('app:settings.display.language')}
            desc={t('app:settings.display.languageDesc')}
          >
            <Select
              small
              minWidth={250}
              isSearchable={false}
              onChange={this.handleChangeLanguage}
              renderSelected={item => item && item.name}
              value={currentLanguage}
              options={languages}
            />
          </Row>
          <Row title={t('app:settings.display.region')} desc={t('app:settings.display.regionDesc')}>
            <Select
              small
              minWidth={250}
              onChange={this.handleChangeRegion}
              renderSelected={item => item && item.name}
              value={currentRegion}
              options={regionsFiltered}
            />
          </Row>
          <Row title={t('app:settings.display.stock')} desc={t('app:settings.display.stockDesc')}>
            <RadioGroup
              items={this.getMarketIndicators()}
              activeKey={cachedMarketIndicator}
              onChange={this.handleChangeMarketIndicator}
            />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default TabProfile
