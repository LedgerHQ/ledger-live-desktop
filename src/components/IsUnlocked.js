// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import bcrypt from 'bcryptjs'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { Settings, T } from 'types/common'

import get from 'lodash/get'

import {
  startSyncCounterValues,
  startSyncAccounts,
  stopSyncAccounts,
  stopSyncCounterValues,
} from 'renderer/events'
import { setEncryptionKey } from 'helpers/db'

import { fetchAccounts } from 'actions/accounts'
import { getAccounts } from 'reducers/accounts'
import { isLocked, unlock } from 'reducers/application'
import { getCounterValue } from 'reducers/settings'

import Box from 'components/base/Box'
import Input from 'components/base/Input'

type InputValue = {
  password: string,
}

type Props = {
  accounts: Account[],
  children: any,
  counterValue: string,
  fetchAccounts: Function,
  isLocked: boolean,
  settings: Settings,
  t: T,
  unlock: Function,
}
type State = {
  inputValue: InputValue,
}

const mapStateToProps = state => ({
  accounts: getAccounts(state),
  counterValue: getCounterValue(state),
  isLocked: isLocked(state),
  settings: state.settings,
})

const mapDispatchToProps: Object = {
  fetchAccounts,
  unlock,
}

const defaultState = {
  inputValue: {
    password: '',
  },
}

class IsUnlocked extends Component<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillMount() {
    if (this.props.isLocked) {
      stopSyncCounterValues()
      stopSyncAccounts()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLocked && !nextProps.isLocked) {
      startSyncCounterValues(nextProps.counterValue, nextProps.accounts)
      startSyncAccounts(nextProps.accounts)
    }

    if (!this.props.isLocked && nextProps.isLocked) {
      stopSyncCounterValues()
      stopSyncAccounts()
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.isLocked) {
      return true
    }

    if (!nextProps.isLocked && this.props.isLocked) {
      return true
    }

    return nextProps.children !== this.props.children
  }

  handleChangeInput = (key: $Keys<InputValue>) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...prev.inputValue,
        [key]: value,
      },
    }))

  handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { settings, unlock, fetchAccounts } = this.props
    const { inputValue } = this.state

    if (bcrypt.compareSync(inputValue.password, get(settings, 'password.value'))) {
      setEncryptionKey('accounts', inputValue.password)
      await fetchAccounts()
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
    const { isLocked, t } = this.props

    if (isLocked) {
      return (
        <Box sticky alignItems="center" justifyContent="center" onClick={this.handleFocusInput}>
          <form onSubmit={this.handleSubmit}>
            <Box>
              <Input
                autoFocus
                innerRef={(n: any) => (this._input = n)}
                placeholder={t('common:password')}
                type="password"
                onChange={this.handleChangeInput('password')}
                value={inputValue.password}
              />
            </Box>
          </form>
        </Box>
      )
    }

    return this.props.children
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false,
  }),
  translate(),
)(IsUnlocked)
