// @flow

import React, { PureComponent } from 'react'
import bcrypt from 'bcryptjs'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import InputPassword from 'components/base/InputPassword'
import Label from 'components/base/Label'
import { ErrorMessageInput } from 'components/base/Input'
import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from 'components/base/Modal'

import type { T } from 'types/common'

type Props = {
  t: T,
  onClose: Function,
  isPasswordEnabled: boolean,
  currentPasswordHash: string,
  onChangePassword: Function,
}

type State = {
  currentPassword: string,
  incorrectPassword: boolean,
}

const INITIAL_STATE = {
  currentPassword: '',
  incorrectPassword: false,
}

class DisablePasswordModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  disablePassword = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }

    const { currentPassword } = this.state
    const { isPasswordEnabled, currentPasswordHash, onChangePassword } = this.props
    if (isPasswordEnabled) {
      if (!bcrypt.compareSync(currentPassword, currentPasswordHash)) {
        this.setState({ incorrectPassword: true })
        return
      }
      onChangePassword('')
    } else {
      onChangePassword('')
    }
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: false })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  render() {
    const { t, isPasswordEnabled, onClose, ...props } = this.props
    const { currentPassword, incorrectPassword } = this.state
    return (
      <Modal
        {...props}
        onHide={this.handleReset}
        onClose={onClose}
        render={({ onClose }) => (
          <form onSubmit={this.disablePassword}>
            <ModalBody onClose={onClose}>
              <ModalTitle>{t('settings:profile.disablePasswordModalTitle')}</ModalTitle>
              <ModalContent>
                <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                  {t('settings:profile.disablePasswordModalDesc')}
                  <Box px={7} mt={4} flow={3}>
                    {isPasswordEnabled && (
                      <Box flow={1}>
                        <Label htmlFor="password">
                          {t('settings:profile.disablePasswordModalInput')}
                        </Label>
                        <InputPassword
                          autoFocus
                          type="password"
                          placeholder={t('settings:profile.disablePasswordModalInput')}
                          id="password"
                          onChange={this.handleInputChange('currentPassword')}
                          value={currentPassword}
                        />
                        {incorrectPassword && (
                          <ErrorMessageInput>
                            {t('password:errorMessageIncorrectPassword')}
                          </ErrorMessageInput>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </ModalContent>
              <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
                <Button type="button" onClick={onClose}>
                  {t('common:cancel')}
                </Button>
                <Button
                  primary
                  onClick={this.disablePassword}
                  disabled={!currentPassword && !incorrectPassword}
                >
                  {t('settings:profile.disablePasswordModalSave')}
                </Button>
              </ModalFooter>
            </ModalBody>
          </form>
        )}
      />
    )
  }
}

export default DisablePasswordModal
