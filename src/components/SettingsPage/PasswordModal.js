// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import bcrypt from 'bcryptjs'

import { unlock } from 'reducers/application'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from 'components/base/Modal'

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
  repeatPassword: string,
}

class PasswordModal extends PureComponent<Props, State> {
  state = {
    currentPassword: '',
    newPassword: '',
    repeatPassword: '',
  }

  handleSave = (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }
    if (!this.isValid()) {
      return
    }
    const { currentPassword, newPassword, repeatPassword } = this.state
    const { isPasswordEnabled, currentPasswordHash, onChangePassword } = this.props
    if (isPasswordEnabled) {
      const calculatedPasswordHash = bcrypt.hashSync(currentPassword, 8)
      if (calculatedPasswordHash !== currentPasswordHash) {
        return
      }
      onChangePassword(newPassword)
    } else if (newPassword === repeatPassword) {
      onChangePassword(newPassword)
    }
  }

  handleInputChange = key => value => this.setState({ [key]: value })

  isValid = () => {
    const { newPassword, repeatPassword } = this.state
    return newPassword && newPassword === repeatPassword
  }

  render() {
    const { t, isPasswordEnabled, onClose, ...props } = this.props
    const isValid = this.isValid()
    return (
      <Modal
        {...props}
        onClose={onClose}
        render={({ onClose }) => (
          <form onSubmit={this.handleSave}>
            <ModalBody onClose={onClose}>
              <ModalTitle>{t('settings:profile.passwordModalTitle')}</ModalTitle>
              <ModalContent>
                <Box ff="Museo Sans|Regular" color="dark" textAlign="center" mb={2} mt={3}>
                  {t('settings:profile.passwordModalSubtitle')}
                </Box>
                <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" px={4}>
                  {t('settings:profile.passwordModalDesc')}
                  <Box px={7} mt={4} flow={3}>
                    {isPasswordEnabled && (
                      <Box flow={1}>
                        <Label htmlFor="password">
                          {t('settings:profile.passwordModalPasswordInput')}
                        </Label>
                        <Input
                          type="password"
                          placeholder={t('settings:profile.passwordModalPasswordInput')}
                          autoFocus
                          id="password"
                          onChange={this.handleInputChange('currentPassword')}
                        />
                      </Box>
                    )}
                    <Box flow={1}>
                      <Label htmlFor="newPassword">
                        {t('settings:profile.passwordModalNewPasswordInput')}
                      </Label>
                      <Input
                        type="password"
                        placeholder={t('settings:profile.passwordModalNewPasswordInput')}
                        id="newPassword"
                        onChange={this.handleInputChange('newPassword')}
                      />
                    </Box>
                    <Box flow={1}>
                      <Label htmlFor="repeatPassword">
                        {t('settings:profile.passwordModalRepeatPasswordInput')}
                      </Label>
                      <Input
                        type="password"
                        placeholder={t('settings:profile.passwordModalRepeatPasswordInput')}
                        id="repeatPassword"
                        onChange={this.handleInputChange('repeatPassword')}
                      />
                    </Box>
                  </Box>
                </Box>
              </ModalContent>
              <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
                <Button onClick={onClose}>{t('common:cancel')}</Button>
                <Button primary onClick={this.handleSave} disabled={!isValid}>
                  {t('settings:profile.passwordModalSave')}
                </Button>
              </ModalFooter>
            </ModalBody>
          </form>
        )}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(PasswordModal)
