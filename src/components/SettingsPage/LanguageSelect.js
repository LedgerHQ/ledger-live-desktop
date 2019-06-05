// @flow

import React from 'react'
import moment from 'moment'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import { setLanguage } from 'actions/settings'
import { langAndRegionSelector } from 'reducers/settings'
import { allLanguages, prodStableLanguages } from 'config/languages'
import Track from 'analytics/Track'
import Select from 'components/base/Select'
import useEnv from 'hooks/useEnv'

type Props = {
  t: T,
  useSystem: boolean,
  language: string,
  setLanguage: (?string) => void,
  i18n: Object,
}

const languageLabels = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ko: '한국어',
  zh: '简体中文',
  ja: '日本語',
  ru: 'Русский',
}

const LanguageSelect = ({ i18n, setLanguage, language, useSystem, t }: Props) => {
  const debugLanguage = useEnv('EXPERIMENTAL_LANGUAGES')

  const languages = [{ value: null, label: t(`language.system`) }].concat(
    (debugLanguage ? allLanguages : prodStableLanguages).map(key => ({
      value: key,
      label: languageLabels[key],
    })),
  )

  const currentLanguage = useSystem ? languages[0] : languages.find(l => l.value === language)

  const handleChangeLanguage = ({ value: languageKey }: *) => {
    i18n.changeLanguage(languageKey)
    moment.locale(languageKey)
    setLanguage(languageKey)
  }

  return (
    <>
      <Track
        onUpdate
        event="LanguageSelect"
        currentRegion={currentLanguage && currentLanguage.value}
      />
      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeLanguage}
        renderSelected={item => item && item.name}
        value={currentLanguage}
        options={languages}
      />
    </>
  )
}

export default translate()(
  connect(
    langAndRegionSelector,
    {
      setLanguage,
    },
  )(LanguageSelect),
)
