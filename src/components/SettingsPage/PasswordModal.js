// @flow

import React, { Fragment, PureComponent } from 'react'

import type { T } from 'types/common'

import db from 'helpers/db'
import { PasswordIncorrectError } from '@ledgerhq/errors'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Modal, { ModalBody } from 'components/base/Modal'

import PasswordForm from './PasswordForm'

type Props = {
  t: T,
  onClose: () => void,
  onChangePassword: (?string) => void,
  hasPassword: boolean,
  isOpened: boolean,
}

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: ?Error,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  incorrectPassword: null,
}

class PasswordModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.isOpened) {
      // CLean the state?
      this.setState(prevState => ({ ...prevState, ...INITIAL_STATE }))
    }
  }

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    const { currentPassword, newPassword } = this.state

    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }

    const { hasPassword, onChangePassword } = this.props
    if (hasPassword) {
      if (!db.isEncryptionKeyCorrect('app', 'accounts', currentPassword)) {
        this.setState({ incorrectPassword: new PasswordIncorrectError() })
        return
      }
      onChangePassword(newPassword)
    } else {
      onChangePassword(newPassword)
    }
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: null })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  isValid = () => {
    const { newPassword, confirmPassword } = this.state
    return newPassword === confirmPassword
  }

  render() {
    const { t, hasPassword, onClose, isOpened, ...props } = this.props
    const { currentPassword, newPassword, incorrectPassword, confirmPassword } = this.state
    return (
      <Modal isOpened={isOpened} centered>
        <ModalBody
          {...props}
          title={hasPassword ? t('password.changePassword.title') : t('password.setPassword.title')}
          onHide={this.handleReset}
          onClose={onClose}
          render={() => (
            <Fragment>
              <Box
                ff="Museo Sans|Regular"
                color="dark"
                textAlign="center"
                mb={2}
                mt={3}
                data-e2e="setPassword_modalTitle"
              >
                {hasPassword
                  ? t('password.changePassword.subTitle')
                  : t('password.setPassword.subTitle')}
              </Box>
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                {t('password.setPassword.desc')}
              </Box>
              <PasswordForm
                onSubmit={this.handleSave}
                hasPassword={hasPassword}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
                incorrectPassword={incorrectPassword}
                isValid={this.isValid}
                onChange={this.handleInputChange}
                t={t}
              />
            </Fragment>
          )}
          renderFooter={() => (
            <Box horizontal align="center" justify="flex-end" flow={2}>
              <Button
                small
                type="button"
                onClick={onClose}
                data-e2e="setPassword_modalCancel_button"
              >
                {t('common.cancel')}
              </Button>
              <Button
                small
                primary
                onClick={this.handleSave}
                disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              >
                {t('common.save')}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export default PasswordModal
