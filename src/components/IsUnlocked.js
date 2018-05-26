// @flow

import bcrypt from 'bcryptjs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { SettingsState as Settings } from 'reducers/settings'
import type { T } from 'types/common'
import IconLockScreen from 'icons/LockScreen'

import get from 'lodash/get'

import { setEncryptionKey } from 'helpers/db'

import { fetchAccounts } from 'actions/accounts'
import { isLocked, unlock } from 'reducers/application'

import Box from 'components/base/Box'
import InputPassword from 'components/base/InputPassword'

type InputValue = {
  password: string,
}

type Props = {
  children: any,
  fetchAccounts: Function,
  isLocked: boolean,
  settings: Settings,
  t: T,
  unlock: Function,
}
type State = {
  inputValue: InputValue,
  incorrectPassword: boolean,
}

const mapStateToProps = state => ({
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
  incorrectPassword: false,
}

export const PageTitle = styled(Box).attrs({
  width: 152,
  height: 27,
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})``

export const LockScreenDesc = styled(Box).attrs({
  width: 340,
  height: 36,
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'center',
  color: 'smoke',
})`
  margin: 10px auto 25px;
`
class IsUnlocked extends Component<Props, State> {
  state = {
    ...defaultState,
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
    } else {
      this.setState({ incorrectPassword: true })
    }
  }

  render() {
    const { inputValue, incorrectPassword } = this.state
    const { isLocked, t } = this.props

    if (isLocked) {
      return (
        <Box sticky alignItems="center" justifyContent="center">
          <form onSubmit={this.handleSubmit}>
            <Box align="center">
              <IconLockScreen size={136} />
              <PageTitle>{t('common:lockScreen.title')}</PageTitle>
              <LockScreenDesc>
                {t('common:lockScreen.description')}
              </LockScreenDesc>
              <Box style={{ minWidth: 230 }}>
                <InputPassword
                  autoFocus
                  placeholder={t('common:lockScreen.inputPlaceholder')}
                  type="password"
                  onChange={this.handleChangeInput('password')}
                  value={inputValue.password}
                  error={incorrectPassword && t('password:errorMessageIncorrectPassword')}
                />
              </Box>
            </Box>
          </form>
        </Box>
      )
    }

    return this.props.children
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
      pure: false,
    },
  ),
  translate(),
)(IsUnlocked)
