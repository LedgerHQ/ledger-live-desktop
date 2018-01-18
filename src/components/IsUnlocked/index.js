// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import type { MapStateToProps } from 'react-redux'
import type { Settings } from 'types/common'

import get from 'lodash/get'

import { setEncryptionKey } from 'helpers/db'

import { fetchAccounts } from 'actions/accounts'
import { isLocked, unlock } from 'reducers/application'

import Box from 'components/base/Box'
import Input from 'components/base/Input'

type InputValue = {
  password: string,
}

type Props = {
  fetchAccounts: Function,
  isLocked: boolean,
  render: Function,
  settings: Settings,
  unlock: Function,
}
type State = {
  inputValue: InputValue,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  settings: state.settings,
  isLocked: isLocked(state),
})

const mapDispatchToProps = {
  fetchAccounts,
  unlock,
}

class IsUnlocked extends PureComponent<Props, State> {
  state = {
    inputValue: {
      password: '',
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

    const { settings, unlock, fetchAccounts } = this.props
    const { inputValue } = this.state

    if (bcrypt.compareSync(inputValue.password, get(settings, 'password.value'))) {
      setEncryptionKey('accounts', inputValue.password)
      fetchAccounts()
      unlock()
    }
  }

  render() {
    const { inputValue } = this.state
    const { isLocked, render } = this.props

    if (isLocked) {
      return (
        <Box sticky align="center" justify="center">
          <form onSubmit={this.handleSubmit}>
            <Box>
              <Input
                placeholder="Password"
                type="password"
                onChange={this.handleChangeInput('password')}
                value={inputValue.password}
              />
            </Box>
          </form>
        </Box>
      )
    }

    return render()
  }
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  pure: false,
})(IsUnlocked)
