// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import get from 'lodash/get'
import set from 'lodash/set'

import { setEncryptionKey } from 'helpers/db'

import type { SettingsProfile, T } from 'types/common'

import { unlock } from 'reducers/application'

import Box, { Card } from 'components/base/Box'
import Input from 'components/base/Input'
import CheckBox from 'components/base/CheckBox'
import Button from 'components/base/Button'
import Label from 'components/base/Label'

type InputValue = SettingsProfile

type Props = {
  t: T,
  settings: SettingsProfile,
  onSaveSettings: Function,
  unlock: Function,
}
type State = {
  inputValue: InputValue,
}

const mapDispatchToProps = {
  unlock,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    inputValue: {
      password: {
        ...this.props.settings.password,
        value: undefined,
      },
    },
  }

  handleChangeInput = (key: string) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...set(prev.inputValue, key, value),
      },
    }))

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { onSaveSettings, unlock } = this.props
    const { inputValue } = this.state

    const settings = {
      ...inputValue,
      password: {
        ...inputValue.password,
        value: '',
      },
    }

    const password = get(inputValue, 'password', {})

    if (password.state === true && password.value.trim() !== '') {
      settings.password.value = bcrypt.hashSync(password.value, 8)
      setEncryptionKey('accounts', password.value)
    } else {
      setEncryptionKey('accounts', undefined)
    }

    unlock()

    onSaveSettings(settings)
  }

  render() {
    const { t } = this.props
    const { inputValue } = this.state

    const isPasswordChecked = get(inputValue, 'password.state', false)
    return (
      <form onSubmit={this.handleSubmit}>
        <Card flow={3}>
          <label>
            <Box
              horizontal
              alignItems="center"
              flow={2}
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleChangeInput('password.state')(!isPasswordChecked)}
            >
              <CheckBox isChecked={isPasswordChecked} />
              <div>{t('settings.profile.protectWithPassword')}</div>
            </Box>
          </label>
          {get(inputValue, 'password.state') === true && (
            <Box flow={1}>
              <Label>{t('settings.profile.password')}</Label>
              <Input
                value={get(inputValue, 'password.value', '')}
                onChange={this.handleChangeInput('password.value')}
                type="password"
              />
            </Box>
          )}
          <Box horizontal justifyContent="flex-end">
            <Button primary type="submit">
              {t('global.save')}
            </Button>
          </Box>
        </Card>
      </form>
    )
  }
}

export default connect(null, mapDispatchToProps)(TabProfile)
