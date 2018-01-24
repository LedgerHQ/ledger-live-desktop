// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { SettingsDisplay, T } from 'types/common'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import Select from 'components/base/Select'

type InputValue = SettingsDisplay

type Props = {
  t: T,
  i18n: Object,
  settings: SettingsDisplay,
  onSaveSettings: Function,
}
type State = {
  inputValue: InputValue,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    inputValue: {
      language: this.props.settings.language,
    },
  }

  getLanguages() {
    const { t } = this.props

    return [
      {
        key: 'en',
        name: t('language.en'),
      },
      {
        key: 'fr',
        name: t('language.fr'),
      },
    ]
  }

  handleChangeInput = (key: $Keys<InputValue>) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...prev.inputValue,
        [key]: value,
      },
    }))

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { onSaveSettings, i18n } = this.props
    const { inputValue } = this.state

    const settings = {
      language: inputValue.language,
    }

    i18n.changeLanguage(settings.language)

    onSaveSettings(settings)
  }

  render() {
    const { t } = this.props
    const { inputValue } = this.state

    const languages = this.getLanguages()
    const currentLanguage = languages.find(l => l.key === inputValue.language)

    return (
      <form onSubmit={this.handleSubmit}>
        <Card>
          <Box>
            <Label>{t('settings.display.language')}</Label>
            <Select
              onChange={item => this.handleChangeInput('language')(item.key)}
              renderSelected={item => item.name}
              value={currentLanguage}
              items={languages}
            />
          </Box>
          <Box>
            <Button type="submit">Save</Button>
          </Box>
        </Card>
      </form>
    )
  }
}

export default translate()(TabProfile)
