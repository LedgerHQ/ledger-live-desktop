// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'

import type { Settings, T } from 'types/common'

import Select from 'components/base/Select'
import IconDisplay from 'icons/Display'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  i18n: Object,
}

type State = {
  cachedLanguageKey: string,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    cachedLanguageKey: this.props.settings.language,
  }

  getDatas() {
    const { t } = this.props
    return {
      languages: [{ key: 'en', name: t('language:en') }, { key: 'fr', name: t('language:fr') }],
    }
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

  render() {
    const { t } = this.props
    const { cachedLanguageKey } = this.state
    const { languages } = this.getDatas()
    const currentLanguage = languages.find(l => l.key === cachedLanguageKey)

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
            {'-'}
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
            {'-'}
          </Row>
          <Row title={t('settings:display.stock')} desc={t('settings:display.stockDesc')}>
            {'-'}
          </Row>
        </Body>
      </Section>
    )
  }
}

export default TabProfile
