// @flow

import React, { PureComponent } from 'react'
import { getFiatUnit } from '@ledgerhq/currencies'

import type { SettingsMoney, T } from 'types/common'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import Select from 'components/base/Select'

const counterValues = ['USD', 'EUR', 'JPY', 'GBP'].sort().map(c => {
  const { name } = getFiatUnit(c)
  return {
    key: c,
    name,
  }
})

type InputValue = SettingsMoney

type Props = {
  t: T,
  settings: SettingsMoney,
  onSaveSettings: Function,
}

type State = {
  inputValue: InputValue,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    inputValue: {
      counterValue: this.props.settings.counterValue,
    },
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

    const { onSaveSettings } = this.props
    const { inputValue } = this.state

    onSaveSettings({
      ...inputValue,
    })
  }

  render() {
    const { t } = this.props
    const { inputValue } = this.state

    const currentCounterValues = counterValues.find(l => l.key === inputValue.counterValue)

    return (
      <form onSubmit={this.handleSubmit}>
        <Card flow={3}>
          <Box flow={1}>
            <Label>{t('settings:display.counterValue')}</Label>
            <Select
              onChange={item => this.handleChangeInput('counterValue')(item.key)}
              renderSelected={item => item && item.name}
              value={currentCounterValues}
              items={counterValues}
            />
          </Box>
          <Box horizontal justifyContent="flex-end">
            <Button primary type="submit">
              {t('common:save')}
            </Button>
          </Box>
        </Card>
      </form>
    )
  }
}

export default TabProfile
