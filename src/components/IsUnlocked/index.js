// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import bcrypt from 'bcryptjs'

import type { MapStateToProps } from 'react-redux'
import type { Settings, Accounts, T } from 'types/common'

import get from 'lodash/get'

import { startSyncAccounts, stopSyncAccounts } from 'renderer/events'
import { setEncryptionKey } from 'helpers/db'

import { fetchAccounts } from 'actions/accounts'
import { getAccounts } from 'reducers/accounts'
import { isLocked, unlock } from 'reducers/application'

import Box from 'components/base/Box'
import Input from 'components/base/Input'

type InputValue = {
  password: string,
}

type Props = {
  t: T,
  accounts: Accounts,
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
  accounts: getAccounts(state),
  settings: state.settings,
  isLocked: isLocked(state),
})

const mapDispatchToProps = {
  fetchAccounts,
  unlock,
}

const defaultState = {
  inputValue: {
    password: '',
  },
}

class IsUnlocked extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillMount() {
    if (this.props.isLocked) {
      stopSyncAccounts()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLocked && !nextProps.isLocked) {
      startSyncAccounts(nextProps.accounts)
    }

    if (!this.props.isLocked && nextProps.isLocked) {
      stopSyncAccounts()
    }
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

      this.setState({
        ...defaultState,
      })
    }
  }

  handleFocusInput = () => {
    if (this._input && this._input !== null) {
      this._input.focus()
    }
  }

  _input: ?HTMLInputElement

  render() {
    const { inputValue } = this.state
    const { isLocked, render, t } = this.props

    if (isLocked) {
      return (
        <Box sticky align="center" justify="center" onClick={this.handleFocusInput}>
          <form onSubmit={this.handleSubmit}>
            <Box>
              <Input
                autoFocus
                innerRef={(n: any) => (this._input = n)}
                placeholder={t('IsUnlocked.password')}
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false,
  }),
  translate(),
)(IsUnlocked)
