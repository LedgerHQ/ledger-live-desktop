// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'
import type { FirmwareUpdateContext } from '@ledgerhq/live-common/lib/types/manager'

import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'
import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'
import logger from 'logger'

import { FreezeDeviceChangeEvents } from '../../ManagerPage/HookDeviceChange'
import StepFullFirmwareInstall from './steps/01-step-install-full-firmware'
import StepFlashMcu from './steps/02-step-flash-mcu'
import StepConfirmation, { StepConfirmFooter } from './steps/03-step-confirmation'

const createSteps = ({ t }: { t: T }): Array<*> => {
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

  return [updateStep, mcuStep, finalStep]
}

export type StepProps = DefaultStepProps & {
  firmware: FirmwareUpdateContext,
  onCloseModal: () => void,
  error: ?Error,
  setError: Error => void,
}

export type StepId = 'idCheck' | 'updateMCU' | 'finish'

type Props = {
  t: T,
  status: ModalStatus,
  onClose: () => void,
  firmware: FirmwareUpdateContext,
  stepId: StepId | string,
}

type State = {
  stepId: StepId | string,
  error: ?Error,
  nonce: number,
}

class UpdateModal extends PureComponent<Props, State> {
  state = {
    stepId: this.props.stepId,
    error: null,
    nonce: 0,
  }

  STEPS = createSteps({
    t: this.props.t,
  })

  setError = (e: Error) => {
    logger.critical(e)
    this.setState({ error: e })
  }

  handleReset = () => this.setState({ stepId: 'idCheck', error: null, nonce: this.state.nonce++ })

  handleStepChange = (step: Step) => this.setState({ stepId: step.id })

  render(): React$Node {
    const { status, t, firmware, onClose, ...props } = this.props
    const { stepId, error, nonce } = this.state

    const additionalProps = {
      error,
      onCloseModal: onClose,
      setError: this.setError,
      firmware,
      ...props,
    }

    return (
      <Modal
        onClose={onClose}
        onHide={this.handleReset}
        isOpened={status === 'install'}
        refocusWhenChange={stepId}
        preventBackdropClick={stepId !== 'finish' && !error}
        render={() => (
          <Stepper
            key={nonce}
            onStepChange={this.handleStepChange}
            title={t('manager.firmware.update')}
            initialStepId={stepId}
            steps={this.STEPS}
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
