// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import type { T } from 'types/common'

import { i } from 'helpers/staticPath'
import TrackPage from 'analytics/TrackPage'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import ProgressCircle from 'components/ProgressCircle'
import TranslatedError from 'components/TranslatedError'

import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from './index'

const Bullet = styled.span`
  font-weight: 600;
  color: #142533;
`

const Separator = styled(Box).attrs({
  color: 'fog',
})`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`

const ConnectStep = ({ t, desc }: { t: *, desc?: string }) => (
  <ModalContent>
    {desc ? (
      <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" mb={6}>
        {desc}
      </Box>
    ) : null}
    <Box mx={7}>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        <Bullet>{'1.'}</Bullet>
        {t('manager.modal.mcuFirst')}
      </Text>
      <img
        src={i('logos/unplugDevice.png')}
        style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
        alt={t('manager.modal.mcuFirst')}
      />
    </Box>
    <Separator my={6} />
    <Box mx={7}>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        <Bullet>{'2.'}</Bullet>
        {t('manager.modal.mcuSecond')}
      </Text>
      <img
        src={i('logos/bootloaderMode.png')}
        style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
        alt={t('manager.modal.mcuFirst')}
      />
    </Box>
  </ModalContent>
)

const FlashStep = ({ progress, t }: { progress: number, t: * }) => (
  <>
    <Box mx={7} align="center">
      <ProgressCircle size={64} progress={progress} />
    </Box>
    <Box mx={7} mt={4} mb={2}>
      <Text ff="Museo Sans|Regular" align="center" color="dark" fontSize={6}>
        {t(`manager.modal.steps.flash`)}
      </Text>
    </Box>
    <Box mx={7} mt={4} mb={7}>
      <Text ff="Open Sans|Regular" align="center" color="graphite" fontSize={4}>
        {t('manager.modal.mcuPin')}
      </Text>
    </Box>
  </>
)

const ErrorStep = ({ error }: { error: Error }) => (
  <Box mx={7} mt={4} mb={6} align="center">
    <TranslatedError error={error} />
  </Box>
)

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
  cancellable?: boolean,
  progress: number,
  error?: Error,
}

class RepairModal extends PureComponent<Props> {
  render() {
    const {
      cancellable,
      isOpened,
      title,
      desc,
      confirmText,
      isDanger,
      onReject,
      onConfirm,
      isLoading,
      renderIcon,
      t,
      analyticsName,
      progress,
      error,
      ...props
    } = this.props

    const realConfirmText = confirmText || t('common.confirm')

    return (
      <Modal
        isOpened={isOpened}
        preventBackdropClick={isLoading}
        {...props}
        render={({ onClose }) => (
          <ModalBody onClose={!cancellable && isLoading ? undefined : onClose}>
            <TrackPage category="Modal" name={analyticsName} />
            <ModalTitle>{title}</ModalTitle>
            {isLoading && progress > 0 ? (
              <FlashStep t={t} progress={progress} />
            ) : error ? (
              <ErrorStep error={error} />
            ) : (
              <ConnectStep t={t} desc={desc} />
            )}
            <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
              {!isLoading && (
                <Button onClick={onReject}>{t(`common.${error ? 'close' : 'cancel'}`)}</Button>
              )}
              {error ? null : (
                <Button
                  onClick={onConfirm}
                  primary={!isDanger}
                  danger={isDanger}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {realConfirmText}
                </Button>
              )}
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(RepairModal)
