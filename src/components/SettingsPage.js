// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import get from 'lodash/get'
import set from 'lodash/set'

import { setEncryptionKey } from 'helpers/db'

import type { MapStateToProps } from 'react-redux'
import type { Settings } from 'types/common'

import { saveSettings } from 'actions/settings'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Button from 'components/base/Button'

const Label = styled.label`
  display: block;
  text-transform: uppercase;
`

type InputValue = Settings

type Props = {
  settings: Settings,
  saveSettings: Function,
}
type State = {
  inputValue: InputValue,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  settings: state.settings,
})

const mapDispatchToProps = {
  saveSettings,
}

class SettingsPage extends PureComponent<Props, State> {
  state = {
    inputValue: {
      ...this.props.settings,
      password: {
        ...this.props.settings.password,
        value: undefined,
      },
    },
  }

  handleChangeInput = (key: $Keys<InputValue>) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...set(prev.inputValue, key, value),
      },
    }))

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { saveSettings } = this.props
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
    }

    saveSettings(settings)
  }

  render() {
    const { inputValue } = this.state

    return (
      <form onSubmit={this.handleSubmit}>
        <Box p={3}>
          <Box>{'settings'}</Box>
          <Box horizontal>
            <input
              type="checkbox"
              checked={get(inputValue, 'password.state')}
              onChange={e => this.handleChangeInput('password.state')(e.target.checked)}
            />{' '}
            with password
          </Box>
          {get(inputValue, 'password.state') === true && (
            <Box>
              <Label>Password</Label>
              <Input
                value={get(inputValue, 'password.value', 'My secure password')}
                onChange={this.handleChangeInput('password.value')}
                type="password"
              />
            </Box>
          )}
          <Box>
            <Button type="submit">Save</Button>
          </Box>
        </Box>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage)
