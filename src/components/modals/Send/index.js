// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import get from 'lodash/get'

import type { T, Account } from 'types/common'
import type { DoubleVal } from 'components/RequestAmount'

import { MODAL_SEND } from 'constants'

import Breadcrumb from 'components/Breadcrumb'
import Modal, { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'

import Footer from './Footer'

import StepAmount from './01-step-amount'
import StepConnectDevice from './02-step-connect-device'
import StepVerification from './03-step-verification'
import StepConfirmation from './04-step-confirmation'

type Props = {
  t: T,
}

type State = {
  stepIndex: number,
  isDeviceReady: boolean,
  amount: DoubleVal,
  account: Account | null,
  recipientAddress: string,
  fees: number,
}

const GET_STEPS = t => [
  { label: t('send:steps.amount.title'), Comp: StepAmount },
  { label: t('send:steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('send:steps.verification.title'), Comp: StepVerification },
  { label: t('send:steps.confirmation.title'), Comp: StepConfirmation },
]

const INITIAL_STATE = {
  stepIndex: 0,
  isDeviceReady: false,
  account: null,
  recipientAddress: '',
  amount: {
    left: 0,
    right: 0,
  },
  fees: 0,
}

class SendModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  _steps = GET_STEPS(this.props.t)

  canNext = account => {
    const { stepIndex } = this.state

    // informations
    if (stepIndex === 0) {
      const { amount, recipientAddress } = this.state
      return !!amount.left && !!recipientAddress && !!account
    }

    // connect device
    if (stepIndex === 1) {
      const { isDeviceReady } = this.state
      return !!isDeviceReady
    }

    return false
  }

  handleReset = () => this.setState(INITIAL_STATE)

  handleNextStep = () => {
    const { stepIndex } = this.state
    if (stepIndex >= this._steps.length - 1) {
      return
    }
    this.setState({ stepIndex: stepIndex + 1 })
  }

  createChangeHandler = key => value => this.setState({ [key]: value })

  renderStep = acc => {
    const { stepIndex, account } = this.state
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step
    const stepProps = {
      ...this.state,
      account: account || acc,
    }
    return <Comp onChange={this.createChangeHandler} {...stepProps} {...this.props} />
  }

  render() {
    const { t } = this.props
    const { stepIndex, amount, account } = this.state

    return (
      <Modal
        name={MODAL_SEND}
        onHide={this.handleReset}
        render={({ data, onClose }) => {
          const acc = account || get(data, 'account', null)
          const canNext = this.canNext(acc)
          return (
            <ModalBody onClose={onClose}>
              <ModalTitle>{t('send:title')}</ModalTitle>
              <ModalContent>
                <Breadcrumb mb={6} mt={2} currentStep={stepIndex} items={this._steps} />
                {this.renderStep(acc)}
              </ModalContent>
              {acc && (
                <Footer
                  canNext={canNext}
                  onNext={this.handleNextStep}
                  account={acc}
                  amount={amount}
                  t={t}
                />
              )}
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default translate()(SendModal)
