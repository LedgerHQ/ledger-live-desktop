// @flow

import React, { PureComponent } from 'react'
import { translate, Trans } from 'react-i18next'
import styled from 'styled-components'
import { forceRepairChoices } from '@ledgerhq/live-common/lib/hw/firmwareUpdate-repair'

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

import Modal from './index'
import ModalBody from './ModalBody'
import {
  generic,
  mcuNotGenuine,
  followDeviceRepair,
  repairProcessing,
} from '../../../config/nontranslatables'

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
  <Box>
    {desc ? (
      <Box ff="Open Sans" color="smoke" fontSize={4} textAlign="center" mb={2}>
        {desc}
      </Box>
    ) : null}
  </Box>
)

const FlashStep = ({ progress, t }: { progress: number, t: * }) =>
  progress === 0 ? (
    <Box>
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
          <Trans i18nKey="manager.modal.mcuSecond">
            {'place holder text'}
            <Text ff="Open Sans|SemiBold">{repairProcessing}</Text>
            {'place holder text'}
          </Trans>
        </Text>
        <img
          src={i('logos/bootloaderMode.png')}
          style={{ width: '100%', maxWidth: 368, marginTop: 30 }}
          alt={t('manager.modal.mcuFirst')}
        />
      </Box>
    </Box>
  ) : (
    <Box>
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
    </Box>
  )

const ErrorStep = ({ error }: { error: Error }) => (
  <Box>
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
  repair: (?string) => *,
  t: T,
  isLoading?: boolean,
  analyticsName: string,
  cancellable?: boolean,
  progress: number,
  error?: Error,
}

class RepairModal extends PureComponent<Props, *> {
  state = {
    selectedOption: forceRepairChoices[0],
  }

  onChange = selectedOption => {
    this.setState({ selectedOption: selectedOption || forceRepairChoices[0] })
  }

  nonTranslatable: { [string]: string } = {
    generic,
    mcuNotGenuine,
    followDeviceRepair,
  }

  renderOption = option => (option && this.nonTranslatable[option.label]) || null

  renderValue = option => (option && this.nonTranslatable[option.data.label]) || null

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
        centered
        preventBackdropClick={isLoading}
        onClose={!cancellable && isLoading ? undefined : onReject}
        {...props}
      >
        <TrackPage category="Modal" name={analyticsName} />
        <ModalBody
          title={title}
          noScroll
          render={() => (
            <Box>
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
                    options={forceRepairChoices}
                    renderOption={this.renderOption}
                    renderValue={this.renderValue}
                  />
                </Box>
              ) : null}
            </Box>
          )}
          renderFooter={() =>
            !isLoading ? (
              <Box horizontal align="center" justify="flex-end" flow={2}>
                <Button onClick={onReject}>{t(`common.${error ? 'close' : 'cancel'}`)}</Button>
                {error ? null : (
                  <>
                    <Button
                      onClick={() => repair(selectedOption.value)}
                      primary={!isDanger}
                      danger={isDanger}
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      {t('settings.repairDevice.button')}
                    </Button>
                  </>
                )}
              </Box>
            ) : null
          }
        />
      </Modal>
    )
  }
}

export default translate()(RepairModal)
