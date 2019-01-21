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
import Select from 'components/base/Select'
import ProgressCircle from 'components/ProgressCircle'
import TranslatedError from 'components/TranslatedError'
import ExclamationCircleThin from 'icons/ExclamationCircleThin'

import { Modal, ModalContent, ModalBody, ModalTitle, ModalFooter } from './index'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

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

const DisclaimerStep = ({ desc }: { desc?: string }) => (
  <ModalContent>
    {desc ? (
      <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" mb={2}>
        {desc}
      </Box>
    ) : null}
  </ModalContent>
)

const FlashStep = ({ progress, t }: { progress: number, t: * }) =>
  progress === 0 ? (
    <ModalContent>
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
  ) : (
    <ModalContent>
      <Box mx={7} align="center">
        <ProgressCircle size={64} progress={progress} />
      </Box>
      <Box mx={7} mt={3} mb={2} ff="Museo Sans|Regular" color="dark" textAlign="center">
        {t(`manager.modal.steps.flash`)}
      </Box>
      <Box mx={7} mt={2} mb={2}>
        <Text ff="Open Sans|Regular" align="center" color="graphite" fontSize={4}>
          {t('manager.modal.mcuPin')}
        </Text>
      </Box>
    </ModalContent>
  )

const ErrorStep = ({ error }: { error: Error }) => (
  <ModalContent>
    <Container>
      <Box color="alertRed">
        <ExclamationCircleThin size={44} />
      </Box>
      <Box
        color="dark"
        mt={4}
        fontSize={6}
        ff="Museo Sans|Regular"
        textAlign="center"
        style={{ maxWidth: 350 }}
      >
        <TranslatedError error={error} field="title" />
      </Box>
      <Box
        color="graphite"
        mt={4}
        fontSize={6}
        ff="Open Sans"
        textAlign="center"
        style={{ maxWidth: 350 }}
      >
        <TranslatedError error={error} field="description" />
      </Box>
    </Container>
  </ModalContent>
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
  repair: (?string) => *,
  t: T,
  isLoading?: boolean,
  analyticsName: string,
  cancellable?: boolean,
  progress: number,
  error?: Error,
}

const options = [{ value: 'generic' }, { value: '0_8' }, { value: '0_9' }]

class RepairModal extends PureComponent<Props, *> {
  state = {
    selectedOption: options[0],
  }

  onChange = selectedOption => {
    this.setState({ selectedOption: selectedOption || options[0] })
  }

  renderOption = option => (option && this.props.t(`settings.repairDevice.${option.value}`)) || null

  renderValue = option =>
    (option && this.props.t(`settings.repairDevice.${option.data.value}`)) || null

  render() {
    const {
      cancellable,
      isOpened,
      title,
      desc,
      confirmText,
      isDanger,
      onReject,
      repair,
      isLoading,
      renderIcon,
      t,
      analyticsName,
      progress,
      error,
      ...props
    } = this.props
    const { selectedOption } = this.state

    return (
      <Modal
        isOpened={isOpened}
        preventBackdropClick={isLoading}
        {...props}
        render={({ onClose }) => (
          <ModalBody onClose={!cancellable && isLoading ? undefined : onClose}>
            <TrackPage category="Modal" name={analyticsName} />
            <ModalTitle>{title}</ModalTitle>
            {error ? (
              <ErrorStep error={error} />
            ) : isLoading ? (
              <FlashStep t={t} progress={progress} />
            ) : (
              <DisclaimerStep desc={desc} />
            )}

            {!isLoading && !error ? (
              <Box py={2} px={5}>
                <Select
                  isSearchable={false}
                  isClearable={false}
                  value={selectedOption}
                  onChange={this.onChange}
                  autoFocus
                  options={options}
                  renderOption={this.renderOption}
                  renderValue={this.renderValue}
                />
              </Box>
            ) : null}

            {!isLoading ? (
              <ModalFooter horizontal align="center" justify="flex-end" flow={2}>
                {error ? <Button onClick={onReject}>{t(`common.close`)}</Button> : null}
                {error ? null : (
                  <>
                    <Button
                      onClick={() =>
                        repair(
                          selectedOption.value === 'generic' ? undefined : selectedOption.value,
                        )
                      }
                      primary={!isDanger}
                      danger={isDanger}
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      {t('settings.repairDevice.button')}
                    </Button>
                  </>
                )}
              </ModalFooter>
            ) : null}
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(RepairModal)
