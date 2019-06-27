// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { remote } from 'electron'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'
import { i } from 'helpers/staticPath'
import IconTriangleWarning from 'icons/TriangleWarning'

import db from 'helpers/db'
import {
  isUnlocked as isLibcoreUnlocked,
  changePassword as changeLibcorePassword,
} from 'helpers/libcoreEncryption'
import { hardReset, resetLibcore } from 'helpers/reset'

import { fetchAccounts } from 'actions/accounts'
import { setLibcorePassword } from 'actions/libcore'
import { isLocked, unlock } from 'reducers/application'

import { PasswordIncorrectError } from '@ledgerhq/errors'

import Box from 'components/base/Box'
import InputPassword from 'components/base/InputPassword'
import LedgerLiveLogo from 'components/base/LedgerLiveLogo'
import IconArrowRight from 'icons/ArrowRight'
import Button from 'components/base/Button/index'
import ConfirmModal from 'components/base/Modal/ConfirmModal'

type InputValue = {
  password: string,
}

type Props = {
  children: any,
  fetchAccounts: Function,
  isLocked: boolean,
  t: T,
  unlock: Function,
  setLibcorePassword: Function,
}
type State = {
  inputValue: InputValue,
  incorrectPassword: ?Error,
  isHardResetting: boolean,
  isHardResetModalOpened: boolean,
}

const mapStateToProps = state => ({
  isLocked: isLocked(state),
})

const mapDispatchToProps: Object = {
  fetchAccounts,
  unlock,
  setLibcorePassword,
}

const defaultState = {
  inputValue: {
    password: '',
  },
  incorrectPassword: null,
  isHardResetting: false,
  isHardResetModalOpened: false,
}

export const PageTitle = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})``

export const LockScreenDesc = styled(Box).attrs({
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
      incorrectPassword: null,
    }))

  unlockDb = async password => {
    const { fetchAccounts } = this.props
    const isAccountsDecrypted = await db.hasBeenDecrypted('app', 'accounts')

    if (isAccountsDecrypted) {
      return db.isEncryptionKeyCorrect('app', 'accounts', password)
    }

    try {
      await db.setEncryptionKey('app', 'accounts', password)
      await fetchAccounts()
      return true
    } catch (error) {
      return false
    }
  }

  unlockLibcore = async password => {
    const { setLibcorePassword } = this.props

    await setLibcorePassword(password)
    const unlockedWithPW = await isLibcoreUnlocked()

    // Migration time!
    if (!unlockedWithPW) {
      // since we know the password is valid for db, if it fails for libcore
      // it can be because of being from a previous version which didn't implement encryption,
      // so let's try without a password
      await setLibcorePassword('')
      // await reloadLibcore()
      const unlockedWithoutPW = await isLibcoreUnlocked()

      if (unlockedWithoutPW) {
        // Libcore is indeed unencrypted, so let's encrypt with db password
        await changeLibcorePassword('', password)
        // And reload with this new password
        await setLibcorePassword(password)
      } else {
        // Something is wrong, let's set the password and reset libcore, so that
        // it creates a brand new db encrypted with the current password
        await setLibcorePassword(password)
        resetLibcore()
      }
    }
  }

  handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { unlock } = this.props
    const { password } = this.state.inputValue

    const dbUnlocked = await this.unlockDb(password)

    // db password is used as the only source of truth because db lock/encryption as been implemented long before libcore one,
    // so, while we're sure the password has been set on db, libcore data can be from an older Ledger Live and not yet be encrypted
    if (dbUnlocked) {
      this.unlockLibcore(password)
      unlock()
      this.setState(defaultState)
    } else {
      this.setState({ incorrectPassword: new PasswordIncorrectError() })
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
              <LedgerLiveLogo
                style={{ marginBottom: 40 }}
                icon={
                  <img
                    src={i('ledgerlive-logo.svg')}
                    alt=""
                    draggable="false"
                    width={50}
                    height={50}
                  />
                }
              />
              <PageTitle>{t('common.lockScreen.title')}</PageTitle>
              <LockScreenDesc>
                {t('common.lockScreen.subTitle')}
                <br />
                {t('common.lockScreen.description')}
              </LockScreenDesc>
              <Box horizontal align="center">
                <Box style={{ width: 280 }}>
                  <InputPassword
                    autoFocus
                    placeholder={t('common.lockScreen.inputPlaceholder')}
                    type="password"
                    onChange={this.handleChangeInput('password')}
                    value={inputValue.password}
                    error={incorrectPassword}
                  />
                </Box>
                <Box ml={2}>
                  <Button style={{ width: 38, height: 38 }} primary onClick={this.handleSubmit}>
                    <Box style={{ alignItems: 'center' }}>
                      <IconArrowRight size={16} />
                    </Box>
                  </Button>
                </Box>
              </Box>
              <Button type="button" mt={3} small onClick={this.handleOpenHardResetModal}>
                {t('common.lockScreen.lostPassword')}
              </Button>
            </Box>
          </form>
          <ConfirmModal
            analyticsName="HardReset"
            isDanger
            centered
            isLoading={isHardResetting}
            isOpened={isHardResetModalOpened}
            onClose={this.handleCloseHardResetModal}
            onReject={this.handleCloseHardResetModal}
            onConfirm={this.handleHardReset}
            confirmText={t('common.reset')}
            title={t('settings.hardResetModal.title')}
            desc={t('settings.hardResetModal.desc')}
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
