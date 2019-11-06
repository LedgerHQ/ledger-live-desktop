// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import Modal, { ModalBody } from 'components/base/Modal'
import { MODAL_RECEIVE } from 'config/constants'
import { useMachine } from '@xstate/react'
import { useDispatch } from 'react-redux'
import { closeModal } from 'reducers/modals'

import {
  machine,
  SELECT_ACCOUNT,
  PREPARE_DEVICE,
  INFORM_USER,
  VERIFY_DEVICE,
  PREV,
} from './receiveFlow'
import Breadcrumb from '../../Breadcrumb'

import SelectAccountStep from './steps/1-select-account'
import PrepareDeviceStep from './steps/2-prepare-device'
import InformUserStep from './steps/3-inform-user'
import VerifyDeviceStep from './steps/4-verify-device'

const STEPS = [
  {
    id: SELECT_ACCOUNT,
    label: <Trans i18nKey="receive.steps.chooseAccount.title" />,
    component: SelectAccountStep,
  },
  {
    id: PREPARE_DEVICE,
    label: <Trans i18nKey="receive.steps.connectDevice.title" />,
    component: PrepareDeviceStep,
  },
  {
    id: INFORM_USER,
    label: <Trans i18nKey="receive.steps.confirmAddress.title" />,
    component: InformUserStep,
  },
  {
    id: VERIFY_DEVICE,
    label: <Trans i18nKey="receive.steps.receiveFunds.title" />,
    component: VerifyDeviceStep,
  },
]

const Receive = () => {
  const [current, send] = useMachine(machine)
  const dispatch = useDispatch()

  const { context, value, nextEvents } = current

  const stepIndex = STEPS.findIndex(step => step.id === value)
  const StepComponent = STEPS[stepIndex].component

  const blockUser = value === VERIFY_DEVICE && context.deviceVerified === null

  return (
    <Modal
      name={MODAL_RECEIVE}
      centered
      refocusWhenChange={value}
      preventBackdropClick={blockUser}
      render={() => (
        <ModalBody
          onClose={blockUser ? undefined : () => dispatch(closeModal(MODAL_RECEIVE))}
          onBack={nextEvents.includes(PREV) ? () => send(PREV) : undefined}
          render={() => (
            <>
              <Breadcrumb
                currentStep={stepIndex}
                items={STEPS}
                stepsDisabled={context.deviceSkipped ? [1, 2] : []}
                stepsErrors={context.verifyAddressError ? [2] : []}
                mb={5}
              />
              <StepComponent send={send} context={context} />
            </>
          )}
          renderFooter={() =>
            StepComponent.Footer ? <StepComponent.Footer send={send} context={context} /> : null
          }
        />
      )}
    />
  )
}

export default Receive
