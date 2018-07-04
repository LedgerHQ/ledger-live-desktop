// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'

import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from './index'

type Props = {
  isOpened: boolean,
  isDanger: boolean,
  title: string,
  subTitle?: string,
  desc: string,
  renderIcon?: Function,
  confirmText?: string,
  cancelText?: string,
  onReject: Function,
  onConfirm: Function,
  t: T,
  isLoading?: boolean,
  analyticsName: string,
}

class ConfirmModal extends PureComponent<Props> {
  render() {
    const {
      isOpened,
      title,
      subTitle,
      desc,
      confirmText,
      cancelText,
      isDanger,
      onReject,
      onConfirm,
      isLoading,
      renderIcon,
      t,
      analyticsName,
      ...props
    } = this.props

    const realConfirmText = confirmText || t('app:common.confirm')
    const realCancelText = cancelText || t('app:common.cancel')
    return (
      <Modal
        isOpened={isOpened}
        preventBackdropClick={isLoading}
        {...props}
        render={({ onClose }) => (
          <ModalBody onClose={isLoading ? undefined : onClose}>
            <TrackPage category="Modal" name={analyticsName} />
            <ModalTitle>{title}</ModalTitle>
            <ModalContent>
              {subTitle && (
                <Box ff="Museo Sans|Regular" color="dark" textAlign="center" mb={2} mt={3}>
                  {subTitle}
                </Box>
              )}
              {renderIcon && (
                <Box justifyContent="center" alignItems="center" mt={4} mb={3}>
                  {renderIcon()}
                </Box>
              )}
              <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center">
                {desc}
              </Box>
            </ModalContent>
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              {!isLoading && <Button onClick={onReject}>{realCancelText}</Button>}
              <Button
                onClick={onConfirm}
                primary={!isDanger}
                danger={isDanger}
                isLoading={isLoading}
              >
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
