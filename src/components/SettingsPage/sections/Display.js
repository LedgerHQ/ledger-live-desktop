// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'

import {
  intermediaryCurrency,
  counterValueCurrencyLocalSelector,
  counterValueExchangeLocalSelector,
} from 'reducers/settings'

import type { SettingsState as Settings } from 'reducers/settings'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import ExchangeSelect from 'components/SelectExchange'
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

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  i18n: Object,
}

type State = {
  cachedLanguageKey: string,
  cachedRegion: string,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    cachedLanguageKey: this.props.settings.language,
    cachedRegion: this.props.settings.region,
  }

  handleChangeLanguage = ({ key: languageKey }: *) => {
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

  render() {
    const { t, settings } = this.props
    const {
      cachedLanguageKey,
      cachedRegion,
    } = this.state

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
          title={t('settings:tabs.display')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row title={t('settings:display.language')} desc={t('settings:display.languageDesc')}>
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
          <Row title={t('settings:display.region')} desc={t('settings:display.regionDesc')}>
            <Select
              small
              minWidth={250}
              onChange={this.handleChangeRegion}
              renderSelected={item => item && item.name}
              value={currentRegion}
              options={regionsFiltered}
            />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default TabProfile
