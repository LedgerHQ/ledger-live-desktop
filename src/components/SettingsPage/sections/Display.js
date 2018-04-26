// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import { listFiats } from '@ledgerhq/currencies'

import type { Settings, T } from 'types/common'

import Select from 'components/base/Select'
import RadioGroup from 'components/base/RadioGroup'

import IconDisplay from 'icons/Display'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const fiats = listFiats().map(fiat => ({
  key: fiat.code,
  fiat,
  name: `${fiat.name} - ${fiat.code}${fiat.symbol ? ` (${fiat.symbol})` : ''}`,
}))

/* temporary subset of countries */
const COUNTRIES = [
  { name: 'China', key: 'CN' },
  { name: 'France', key: 'FR' },
  { name: 'India', key: 'IN' },
  { name: 'Italy', key: 'IT' },
  { name: 'Japan', key: 'JP' },
  { name: 'Russian Federation', key: 'RU' },
  { name: 'Singapore', key: 'SG' },
  { name: 'Switzerland', key: 'CH' },
  { name: 'United Kingdom', key: 'GB' },
  { name: 'United States', key: 'US' },
]

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
  cachedRegion: Object,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    cachedMarketIndicator: this.props.settings.marketIndicator,
    cachedLanguageKey: this.props.settings.language,
    cachedCounterValue: fiats.find(fiat => fiat.fiat.code === this.props.settings.counterValue),
    cachedRegion: this.props.settings.region,
  }

  getDatas() {
    const { t } = this.props
    return {
      languages: [{ key: 'en', name: t('language:en') }, { key: 'fr', name: t('language:fr') }],
    }
  }

  getMarketIndicators() {
    const { t } = this.props
    return [
      {
        label: t('common:eastern'),
        key: 'eastern',
      },
      {
        label: t('common:western'),
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

  handleChangeLanguage = (languageKey: string) => {
    const { i18n, saveSettings } = this.props
    this.setState({ cachedLanguageKey: languageKey })
    window.requestIdleCallback(() => {
      i18n.changeLanguage(languageKey)
      moment.locale(languageKey)
      saveSettings({ language: languageKey })
    })
  }

  handleChangeRegion = (region: Object) => {
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

  render() {
    const { t } = this.props
    const {
      cachedMarketIndicator,
      cachedLanguageKey,
      cachedCounterValue,
      cachedRegion,
    } = this.state
    const { languages } = this.getDatas()
    const currentLanguage = languages.find(l => l.key === cachedLanguageKey)
    const currentRegion = COUNTRIES.find(r => r.key === cachedRegion.key)

    return (
      <Section>
        <Header
          icon={<IconDisplay size={16} />}
          title={t('settings:tabs.display')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row
            title={t('settings:display.counterValue')}
            desc={t('settings:display.counterValueDesc')}
          >
            <Select
              searchable
              fuseOptions={{ keys: ['name'] }}
              style={{ minWidth: 250 }}
              small
              onChange={item => this.handleChangeCounterValue(item)}
              itemToString={item => (item ? item.name : '')}
              renderSelected={item => item && item.name}
              items={fiats}
              value={cachedCounterValue}
            />
          </Row>
          <Row title={t('settings:display.language')} desc={t('settings:display.languageDesc')}>
            <Select
              style={{ minWidth: 130 }}
              small
              onChange={item => this.handleChangeLanguage(item.key)}
              renderSelected={item => item && item.name}
              value={currentLanguage}
              items={languages}
            />
          </Row>
          <Row title={t('settings:display.region')} desc={t('settings:display.regionDesc')}>
            <Select
              searchable
              fuseOptions={{ keys: ['name'] }}
              style={{ minWidth: 130 }}
              small
              onChange={item => this.handleChangeRegion(item)}
              renderSelected={item => item && item.name}
              value={currentRegion}
              items={COUNTRIES}
            />
          </Row>
          <Row title={t('settings:display.stock')} desc={t('settings:display.stockDesc')}>
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
