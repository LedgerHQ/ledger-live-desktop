// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import get from 'lodash/get'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { T } from 'types/common'

import { MODAL_SEND } from 'config/constants'

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
  amount: number,
  fees: number,
  account: Account | null,
  recipientAddress: string,
  isRBF: boolean,
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
  amount: 0,
  fees: 0,
  isRBF: false,
}

class SendModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  _steps = GET_STEPS(this.props.t)
  _account: Account | null = null

  canNext = account => {
    const { stepIndex } = this.state

    // informations
    if (stepIndex === 0) {
      const { amount, recipientAddress } = this.state
      return !!amount && !!recipientAddress && !!account
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

  createChangeHandler = key => value => {
    const patch = { [key]: value }
    // ensure max is always restecped when changing fees
    if (key === 'fees') {
      const { amount } = this.state
      // if changing fees goes further than max, change amount
      if (this._account && amount + value > this._account.balance) {
        const diff = amount + value - this._account.balance
        patch.amount = amount - diff
        // if the user is a little joker, and try to put fees superior
        // to the max, let's reset amount to 0 and put fees to max.
        if (patch.amount < 0) {
          patch.amount = 0
          patch.fees = this._account.balance
        }
      }
    }
    this.setState(patch)
  }

  renderStep = acc => {
    const { stepIndex, account, amount, ...othersState } = this.state
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step
    const stepProps = {
      ...othersState,
      amount,
      account: account || acc,
    }

    return <Comp onChange={this.createChangeHandler} {...stepProps} {...this.props} />
  }

  render() {
    const { t } = this.props
    const { stepIndex, amount, account, fees } = this.state

    return (
      <Modal
        name={MODAL_SEND}
        onHide={this.handleReset}
        render={({ data, onClose }) => {
          const acc = account || get(data, 'account', null)
          const canNext = this.canNext(acc)

          // hack: access the selected account, living in modal data, outside
          // of the modal render function
          this._account = acc

          return (
            <ModalBody onClose={onClose} deferHeight={acc ? 630 : 355}>
              <ModalTitle>{t('send:title')}</ModalTitle>
              <ModalContent>
                <Breadcrumb mb={5} mt={2} currentStep={stepIndex} items={this._steps} />
                {this.renderStep(acc)}
              </ModalContent>
              {acc && (
                <Footer
                  canNext={canNext}
                  onNext={this.handleNextStep}
                  account={acc}
                  amount={amount}
                  fees={fees}
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
