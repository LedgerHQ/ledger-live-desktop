// @flow

import React, { Fragment, PureComponent } from 'react'
import moment from 'moment'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import { setLanguage } from 'actions/settings'
import { langAndRegionSelector } from 'reducers/settings'
import languageKeys from 'config/languages'
import Track from 'analytics/Track'
import Select from 'components/base/Select'

type Props = {
  t: T,
  useSystem: boolean,
  language: string,
  setLanguage: (?string) => void,
  i18n: Object,
}

class LanguageSelect extends PureComponent<Props> {
  languageLabels = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    ko: '한국어',
    zh: '简体中文',
    ja: '日本語',
    ru: 'Русский',
  }

  handleChangeLanguage = ({ value: languageKey }: *) => {
    const { i18n, setLanguage } = this.props
    i18n.changeLanguage(languageKey)
    moment.locale(languageKey)
    setLanguage(languageKey)
  }

  languages = [{ value: null, label: this.props.t(`language.system`) }].concat(
    languageKeys.map(key => ({ value: key, label: this.languageLabels[key] })),
  )

  render() {
    const { language, useSystem } = this.props
    const currentLanguage = useSystem
      ? this.languages[0]
      : this.languages.find(l => l.value === language)
    return (
      <Fragment>
        <Track
          onUpdate
          event="LanguageSelect"
          currentRegion={currentLanguage && currentLanguage.value}
        />
        <Select
          small
          minWidth={250}
          isSearchable={false}
          onChange={this.handleChangeLanguage}
          renderSelected={item => item && item.name}
          value={currentLanguage}
          options={this.languages}
        />
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    langAndRegionSelector,
    {
      setLanguage,
    },
  )(LanguageSelect),
)
