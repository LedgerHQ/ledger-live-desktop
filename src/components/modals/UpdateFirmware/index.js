// @flow
import React, { PureComponent, Fragment } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import Button from 'components/base/Button'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'
import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'
import type { LedgerScriptParams } from 'helpers/common'

import StepOSUInstaller from './steps/01-step-osu-installer'
import StepFlashMcu from './steps/02-step-flash-mcu'
import StepConfirmation, { StepConfirmFooter } from './steps/03-step-confirmation'

export type StepProps = DefaultStepProps & {
  firmware: ?LedgerScriptParams,
  onCloseModal: () => void,
}

type StepId = 'idCheck' | 'updateMCU' | 'finish'

// FIXME: Debugging for now to move between steps
// Remove when plugged to firmware update
function DebugFooter({
  transitionTo,
  where,
}: {
  where: string,
  transitionTo: (where: string) => void,
}) {
  return <Button onClick={() => transitionTo(where)}>{where}</Button>
}

const createSteps = ({ t }: { t: T }) => [
  {
    id: 'idCheck',
    label: t('app:manager.modal.steps.idCheck'),
    component: StepOSUInstaller,
    footer: ({ firmware, ...props }: StepProps) => (
      <DebugFooter firmware={firmware} {...props} where="updateMCU" />
    ),
    onBack: null,
    hideFooter: false,
  },
  {
    id: 'updateMCU',
    label: t('app:manager.modal.steps.updateMCU'),
    component: StepFlashMcu,
    footer: ({ firmware, ...props }: StepProps) => (
      <Fragment>
        <DebugFooter firmware={firmware} {...props} where="idCheck" />
        <DebugFooter firmware={firmware} {...props} where="finish" />
      </Fragment>
    ),
    onBack: null,
    hideFooter: false,
  },
  {
    id: 'finish',
    label: t('app:addAccounts.breadcrumb.finish'),
    component: StepConfirmation,
    footer: StepConfirmFooter,
    onBack: null,
    hideFooter: false,
  },
]

type Props = {
  t: T,
  status: ModalStatus,
  onClose: () => void,
  firmware: ?LedgerScriptParams,
}

type State = {
  stepId: StepId | string,
}

class UpdateModal extends PureComponent<Props, State> {
  state = {
    stepId: 'idCheck',
  }

  STEPS = createSteps({ t: this.props.t })

  handleStepChange = (step: Step) => this.setState({ stepId: step.id })

  render(): React$Node {
    const { status, t, firmware, onClose } = this.props
    const { stepId } = this.state

    const additionalProps = {
      firmware,
      onCloseModal: onClose,
    }

    return (
      <Modal
        onClose={onClose}
        isOpened={status === 'install'}
        refocusWhenChange={stepId}
        render={() => (
          <Stepper
            title={t('app:manager.firmware.update')}
            initialStepId="idCheck"
            steps={this.STEPS}
            {...additionalProps}
          >
            <SyncSkipUnderPriority priority={100} />
          </Stepper>
        )}
      />
    )
  }
}

export default translate()(UpdateModal)
