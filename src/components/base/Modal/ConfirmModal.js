// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Button from 'components/base/Button'
import Box from 'components/base/Box'

import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from './index'

type Props = {
  isOpened: boolean,
  isDanger: boolean,
  title: string,
  subTitle: string,
  desc: string,
  confirmText: string,
  cancelText: string,
  t: T,
}

class ConfirmModal extends PureComponent<Props> {
  render() {
    const { isOpened, title, subTitle, desc, confirmText, cancelText, isDanger, t } = this.props

    const realConfirmText = confirmText || t('common:confirm')
    const realCancelText = cancelText || t('common:cancel')
    return (
      <Modal
        isOpened={isOpened}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>
              {subTitle && (
                <Box ff="Museo Sans|Regular" color="dark" textAlign="center" mb={2} mt={3}>
                  {subTitle}
                </Box>
              )}
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center">
                {desc}
              </Box>
            </ModalContent>
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              <Button>{realCancelText}</Button>
              <Button primary={!isDanger} danger={isDanger}>
                {realConfirmText}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(ConfirmModal)
