// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { DeviceModelId } from '@ledgerhq/devices'

import type { T } from 'types/common'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'
import type { FirmwareUpdateContext } from '@ledgerhq/live-common/lib/types/manager'

import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'
import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'
import logger from 'logger'

import { FreezeDeviceChangeEvents } from '../../ManagerPage/HookDeviceChange'
import StepResetDevice, { StepResetFooter } from './steps/00-step-reset-device'
import StepFullFirmwareInstall from './steps/01-step-install-full-firmware'
import StepFlashMcu from './steps/02-step-flash-mcu'
import StepConfirmation, { StepConfirmFooter } from './steps/03-step-confirmation'

const createSteps = ({ t, deviceModel }: { t: T, deviceModel: DeviceModelId }): Array<*> => {
  const updateStep = {
    id: 'idCheck',
    label: t('manager.modal.identifier'),
    component: StepFullFirmwareInstall,
    footer: null,
    onBack: null,
    hideFooter: true,
  }

  const finalStep = {
    id: 'finish',
    label: t('addAccounts.breadcrumb.finish'),
    component: StepConfirmation,
    footer: StepConfirmFooter,
    onBack: null,
    hideFooter: false,
  }

  const mcuStep = {
    id: 'updateMCU',
    label: t('manager.modal.steps.updateMCU'),
    component: StepFlashMcu,
    footer: null,
    onBack: null,
    hideFooter: true,
  }

  const resetStep = {
    id: 'resetDevice',
    label: t('manager.modal.steps.reset'),
    component: StepResetDevice,
    footer: StepResetFooter,
    onBack: null,
    hideFooter: false,
  }

  let steps = [updateStep, mcuStep, finalStep]
  if (deviceModel === 'blue') steps = [resetStep, ...steps]

  return steps
}

export type StepProps = DefaultStepProps & {
  firmware: FirmwareUpdateContext,
  onCloseModal: () => void,
  error: ?Error,
  setError: Error => void,
  deviceModelId: DeviceModelId,
}

export type StepId = 'idCheck' | 'updateMCU' | 'finish' | 'resetDevice'

type Props = {
  t: T,
  status: ModalStatus,
  onClose: () => void,
  firmware: FirmwareUpdateContext,
  stepId: StepId,
  error: ?Error,
  deviceModelId: DeviceModelId,
}

type State = {
  stepId: StepId | string,
  error: ?Error,
  nonce: number,
}

class UpdateModal extends PureComponent<Props, State> {
  state = {
    stepId: this.props.stepId,
    error: this.props.error || null,
    nonce: 0,
  }

  STEPS = createSteps({
    t: this.props.t,
    deviceModel: this.props.deviceModelId,
  })

  setError = (e: Error) => {
    logger.critical(e)
    this.setState({ error: e })
  }

  handleReset = () =>
    this.setState({
      stepId: this.STEPS[0].id,
      error: null,
      nonce: this.state.nonce++,
    })

  handleStepChange = (step: Step) => this.setState({ stepId: step.id })

  render(): React$Node {
    const { status, t, firmware, onClose, deviceModelId, ...props } = this.props
    const { stepId, error, nonce } = this.state

    const steps = this.STEPS.map(step => step.id)
    const errorSteps = error ? [steps.indexOf(stepId)] : []

    const additionalProps = {
      ...props,
      onCloseModal: onClose,
      setError: this.setError,
      firmware,
      error,
    }

    return (
      <Modal
        width={550}
        onClose={onClose}
        centered
        onHide={this.handleReset}
        isOpened={status === 'install'}
        refocusWhenChange={stepId}
        preventBackdropClick={!['finish', 'resetDevice'].includes(stepId) && !error}
        render={() => (
          <Stepper
            key={nonce}
            onStepChange={this.handleStepChange}
            title={t('manager.firmware.update')}
            initialStepId={stepId}
            steps={this.STEPS}
            errorSteps={errorSteps}
            deviceModelId={deviceModelId}
            {...additionalProps}
          >
            <FreezeDeviceChangeEvents />
            <SyncSkipUnderPriority priority={100} />
          </Stepper>
        )}
      />
    )
  }
}

export default translate()(UpdateModal)
