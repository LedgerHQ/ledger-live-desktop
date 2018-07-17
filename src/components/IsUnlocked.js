// @flow

import bcrypt from 'bcryptjs'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { remote } from 'electron'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { SettingsState as Settings } from 'reducers/settings'
import type { T } from 'types/common'
import { i } from 'helpers/staticPath'
import IconTriangleWarning from 'icons/TriangleWarning'
import get from 'lodash/get'

import { setEncryptionKey } from 'helpers/db'
import hardReset from 'helpers/hardReset'

import { fetchAccounts } from 'actions/accounts'
import { isLocked, unlock } from 'reducers/application'

import { createCustomErrorClass } from 'helpers/errors'

import Box from 'components/base/Box'
import InputPassword from 'components/base/InputPassword'
import Button from './base/Button/index'
import ConfirmModal from './base/Modal/ConfirmModal'

const PasswordIncorrectError = createCustomErrorClass('PasswordIncorrect')

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
  isHardResetting: boolean,
  isHardResetModalOpened: boolean,
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
  isHardResetting: false,
  isHardResetModalOpened: false,
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
      incorrectPassword: false,
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

  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true })
  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false })

  handleHardReset = async () => {
    this.setState({ isHardResetting: true })
    try {
      await hardReset()
      remote.getCurrentWindow().webContents.reloadIgnoringCache()
    } catch (err) {
      this.setState({ isHardResetting: false })
    }
  }
  hardResetIconRender = () => (
    <IconWrapperCircle color="alertRed">
      <IconTriangleWarning width={23} height={21} />
    </IconWrapperCircle>
  )
  render() {
    const { inputValue, incorrectPassword, isHardResetting, isHardResetModalOpened } = this.state
    const { isLocked, t } = this.props

    if (isLocked) {
      return (
        <Box sticky alignItems="center" justifyContent="center">
          <form onSubmit={this.handleSubmit}>
            <Box align="center">
              <div
                style={{
                  padding: 14,
                  backgroundColor: 'white',
                  borderRadius: 80,
                  fontSize: 0,
                  marginBottom: 40,
                  boxShadow: '0 2px 23px 0 rgba(0, 0, 0, 0.08)',
                }}
              >
                <img alt="" src={i('ledgerlive-logo.svg')} width={50} height={50} />
              </div>
              <PageTitle>{t('app:common.lockScreen.title')}</PageTitle>
              <LockScreenDesc>
                {t('app:common.lockScreen.subTitle')}
                <br />
                {t('app:common.lockScreen.description')}
              </LockScreenDesc>
              <Box style={{ minWidth: 230 }}>
                <InputPassword
                  autoFocus
                  placeholder={t('app:common.lockScreen.inputPlaceholder')}
                  type="password"
                  onChange={this.handleChangeInput('password')}
                  value={inputValue.password}
                  error={incorrectPassword && new PasswordIncorrectError()}
                />
              </Box>
              <Button type="button" mt={3} small onClick={this.handleOpenHardResetModal}>
                {t('app:common.lockScreen.lostPassword')}
              </Button>
            </Box>
          </form>
          <ConfirmModal
            analyticsName="HardReset"
            isDanger
            isLoading={isHardResetting}
            isOpened={isHardResetModalOpened}
            onClose={this.handleCloseHardResetModal}
            onReject={this.handleCloseHardResetModal}
            onConfirm={this.handleHardReset}
            confirmText={t('app:common.reset')}
            title={t('app:settings.hardResetModal.title')}
            desc={t('app:settings.hardResetModal.desc')}
            renderIcon={this.hardResetIconRender}
          />
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

const IconWrapperCircle = styled(Box).attrs({})`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  text-align: -webkit-center;
  justify-content: center;
`
