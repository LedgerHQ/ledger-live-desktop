// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import { unlock } from 'reducers/application'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import InputPassword from 'components/base/InputPassword'
import Label from 'components/base/Label'
import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from 'components/base/Modal'
import { ErrorMessageInput } from 'components/base/Input'

import PasswordForm from './PasswordForm'
import type { T } from 'types/common'

const mapDispatchToProps = {
  unlock,
}

type Props = {
  t: T,
  onClose: Function,
  unlock: Function,
  isPasswordEnabled: boolean,
  currentPasswordHash: string,
  onChangePassword: Function,
}

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  incorrectPassword: boolean,
}

const INITIAL_STATE = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  incorrectPassword: false,
}

class PasswordModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }
    const { currentPassword, newPassword, confirmPassword } = this.state
    const { isPasswordEnabled, currentPasswordHash, onChangePassword } = this.props
    if (isPasswordEnabled) {
      if (!bcrypt.compareSync(currentPassword, currentPasswordHash)) {
        this.setState({ incorrectPassword: true })
        return
      }
      onChangePassword(newPassword)
    } else {
      onChangePassword(newPassword)
    }
  }

  handleInputChange = (key: string) => (value: string) => {
    if (this.state.incorrectPassword) {
      this.setState({ incorrectPassword: false })
    }
    this.setState({ [key]: value })
  }

  handleReset = () => this.setState(INITIAL_STATE)

  isValid = () => {
    const { newPassword } = this.state
    return newPassword
  }

  render() {
    const { t, isPasswordEnabled, onClose, ...props } = this.props
    const { currentPassword, newPassword, incorrectPassword, confirmPassword } = this.state
    const isValid = this.isValid()
    return (
      <Modal
        {...props}
        onHide={this.handleReset}
        onClose={onClose}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('settings:profile.passwordModalTitle')}</ModalTitle>
            <ModalContent>
              <Box ff="Museo Sans|Regular" color="dark" textAlign="center" mb={2} mt={3}>
                {t('settings:profile.passwordModalSubtitle')}
              </Box>
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                {t('settings:profile.passwordModalDesc')}
              </Box>
              <PasswordForm
                onSubmit={this.handleSave}
                isPasswordEnabled={isPasswordEnabled}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
                incorrectPassword={incorrectPassword}
                onChange={this.handleInputChange}
                t={t}
              />
            </ModalContent>
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              <Button type="button" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button primary onClick={this.handleSave} disabled={!isValid}>
                {t('settings:profile.passwordModalSave')}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(PasswordModal)
