// @flow

import React, { PureComponent } from 'react'
import { PasswordIncorrectError } from '@ledgerhq/errors'

import db from 'helpers/db'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import InputPassword from 'components/base/InputPassword'
import Label from 'components/base/Label'
import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'

import type { T } from 'types/common'

type Props = {
  t: T,
  onClose: Function,
  onChangePassword: Function,
}

type State = {
  currentPassword: string,
  incorrectPassword: ?Error,
}

const INITIAL_STATE = {
  currentPassword: '',
  incorrectPassword: null,
}

// TODO: combine with the refactored password form
class DisablePasswordModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  disablePassword = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }

    const { currentPassword } = this.state
    const { onChangePassword } = this.props

    if (!db.isEncryptionKeyCorrect('app', 'accounts', currentPassword)) {
      this.setState({ incorrectPassword: new PasswordIncorrectError() })
      return
    }

    onChangePassword('')
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: null })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  render() {
    const { t, onClose, ...props } = this.props
    const { currentPassword, incorrectPassword } = this.state
    return (
      <Modal {...props} centered onHide={this.handleReset} onClose={onClose}>
        <form onSubmit={this.disablePassword}>
          <ModalBody
            onClose={onClose}
            title={t('password.disablePassword.title')}
            render={() => (
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                {t('password.disablePassword.desc')}
                <Box px={7} mt={4} flow={3}>
                  <Box flow={1}>
                    <Label htmlFor="password">
                      {t('password.inputFields.currentPassword.label')}
                    </Label>
                    <InputPassword
                      autoFocus
                      type="password"
                      id="password"
                      onChange={this.handleInputChange('currentPassword')}
                      value={currentPassword}
                      error={incorrectPassword}
                    />
                  </Box>
                </Box>
              </Box>
            )}
            renderFooter={() => (
              <Box horizontal align="center" justify="flex-end" flow={2}>
                <Button small type="button" onClick={onClose}>
                  {t('common.cancel')}
                </Button>
                <Button
                  small
                  primary
                  onClick={this.disablePassword}
                  disabled={!currentPassword && !incorrectPassword}
                >
                  {t('common.save')}
                </Button>
              </Box>
            )}
          />
        </form>
      </Modal>
    )
  }
}

export default DisablePasswordModal
