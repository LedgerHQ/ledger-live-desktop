// @flow

import React, { PureComponent } from 'react'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from 'components/base/Modal'

import type { T } from 'types/common'

type Props = {
  t: T,
  onClose: Function,
}

class PasswordModal extends PureComponent<Props> {
  render() {
    const { t, onClose, ...props } = this.props
    return (
      <Modal
        {...props}
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
                <Box px={7} mt={4} flow={3}>
                  <Box flow={1}>
                    <Label htmlFor="password">
                      {t('settings:profile.passwordModalPasswordInput')}
                    </Label>
                    <Input
                      placeholder={t('settings:profile.passwordModalPasswordInput')}
                      autoFocus
                      id="password"
                    />
                  </Box>
                  <Box flow={1}>
                    <Label htmlFor="newPassword">
                      {t('settings:profile.passwordModalNewPasswordInput')}
                    </Label>
                    <Input
                      placeholder={t('settings:profile.passwordModalNewPasswordInput')}
                      id="newPassword"
                    />
                  </Box>
                  <Box flow={1}>
                    <Label htmlFor="repeatPassword">
                      {t('settings:profile.passwordModalRepeatPasswordInput')}
                    </Label>
                    <Input
                      placeholder={t('settings:profile.passwordModalRepeatPasswordInput')}
                      id="repeatPassword"
                    />
                  </Box>
                </Box>
              </Box>
            </ModalContent>
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              <Button onClick={onClose}>{t('common:cancel')}</Button>
              <Button primary>{t('settings:profile.passwordModalSave')}</Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default PasswordModal
