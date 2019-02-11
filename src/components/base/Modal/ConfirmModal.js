// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'

import Modal from './index'
import ModalBody from './ModalBody'

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
  onClose?: Function,
  onConfirm: Function,
  t: T,
  isLoading?: boolean,
  analyticsName: string,
  cancellable?: boolean,
  centered?: boolean,
}

class ConfirmModal extends PureComponent<Props> {
  render() {
    const {
      cancellable,
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
      onClose,
      t,
      analyticsName,
      centered,
      ...props
    } = this.props

    const realConfirmText = confirmText || t('common.confirm')
    const realCancelText = cancelText || t('common.cancel')
    return (
      <Modal isOpened={isOpened} centered={centered}>
        <ModalBody
          preventBackdropClick={isLoading}
          {...props}
          onClose={!cancellable && isLoading ? undefined : onClose}
          title={title}
          renderFooter={() => (
            <Box horizontal align="center" justify="flex-end" flow={2}>
              {!isLoading && <Button onClick={onReject}>{realCancelText}</Button>}
              <Button
                onClick={onConfirm}
                primary={!isDanger}
                danger={isDanger}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {realConfirmText}
              </Button>
            </Box>
          )}
          render={() => (
            <Box>
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
            </Box>
          )}
        />
        <TrackPage category="Modal" name={analyticsName} />
      </Modal>
    )
  }
}

export default translate()(ConfirmModal)
