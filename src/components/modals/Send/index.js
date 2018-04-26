// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { T, Device } from 'types/common'

import { getVisibleAccounts } from 'reducers/accounts'

import { MODAL_SEND } from 'config/constants'

import Breadcrumb from 'components/Breadcrumb'
import Button from 'components/base/Button'
import Modal, { ModalFooter, ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import PrevButton from 'components/modals/PrevButton'
import StepConnectDevice from 'components/modals/StepConnectDevice'

import Footer from './Footer'

import StepAmount from './01-step-amount'
import StepVerification from './03-step-verification'
import StepConfirmation from './04-step-confirmation'

type Props = {
  accounts: Account[],
  t: T,
}

type State = {
  account: Account | null,
  amount: number,
  appStatus: null | string,
  deviceSelected: Device | null,
  fees: number,
  isRBF: boolean,
  recipientAddress: string,
  stepIndex: number,
}

const GET_STEPS = t => [
  { label: t('send:steps.amount.title'), Comp: StepAmount },
  { label: t('send:steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('send:steps.verification.title'), Comp: StepVerification },
  { label: t('send:steps.confirmation.title'), Comp: StepConfirmation },
]

const mapStateToProps = state => ({
  accounts: getVisibleAccounts(state).sort((a, b) => (a.name < b.name ? -1 : 1)),
})

const INITIAL_STATE = {
  account: null,
  amount: 0,
  appStatus: null,
  deviceSelected: null,
  fees: 0,
  isRBF: false,
  recipientAddress: '',
  stepIndex: 0,
}

class SendModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  _account: Account | null = null
  _steps = GET_STEPS(this.props.t)

  canNext = () => {
    const { stepIndex } = this.state

    if (stepIndex === 0) {
      const { amount, recipientAddress } = this.state
      return !!amount && !!recipientAddress && !!this._account
    }

    if (stepIndex === 1) {
      const { deviceSelected, appStatus } = this.state
      return deviceSelected !== null && appStatus === 'success'
    }

    if (stepIndex === 2) {
      return true
    }

    return false
  }

  canPrev = () => {
    const { stepIndex } = this.state

    if (stepIndex === 1) {
      return true
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

  handleChangeDevice = d => this.setState({ deviceSelected: d })

  handleChangeStatus = (deviceStatus, appStatus) => this.setState({ appStatus })

  handlePrevStep = () => {
    const { stepIndex } = this.state

    let newStepIndex

    switch (stepIndex) {
      default:
      case 1:
        newStepIndex = 0
        break

      case 2:
      case 3:
        newStepIndex = 1
        break
    }

    this.setState({
      appStatus: null,
      deviceSelected: null,
      stepIndex: newStepIndex,
    })
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

  renderStep = () => {
    const { t } = this.props
    const { stepIndex, amount, deviceSelected, ...otherState } = this.state
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step

    const props = (predicate, props) => (predicate ? props : {})

    const stepProps = {
      ...otherState,
      t,
      amount,
      account: this._account,
      ...props(stepIndex === 1, {
        accountName: this._account ? this._account.name : undefined,
        deviceSelected,
        onChangeDevice: this.handleChangeDevice,
        onStatusChange: this.handleChangeStatus,
      }),
    }

    return <Comp onChange={this.createChangeHandler} {...stepProps} {...this.props} />
  }

  render() {
    const { accounts, t } = this.props
    const { stepIndex, amount, account, fees } = this.state

    const canNext = this.canNext()
    const canPrev = this.canPrev()

    return (
      <Modal
        name={MODAL_SEND}
        onHide={this.handleReset}
        render={({ data, onClose }) => {
          // hack: access the selected account, living in modal data, outside
          // of the modal render function
          this._account = account || (data && data.account) || accounts[0]

          return (
            <ModalBody onClose={onClose}>
              <ModalTitle>
                {canPrev && <PrevButton onClick={this.handlePrevStep} />}
                {t('send:title')}
              </ModalTitle>
              <ModalContent>
                <Breadcrumb mb={6} currentStep={stepIndex} items={this._steps} />
                {this.renderStep()}
              </ModalContent>
              {this._account &&
                stepIndex < 2 && (
                  <Footer
                    canNext={canNext}
                    onNext={this.handleNextStep}
                    account={this._account}
                    amount={amount}
                    fees={fees}
                    showTotal={stepIndex === 0}
                    t={t}
                  />
                )}
              {stepIndex === 3 && (
                <ModalFooter horizontal alignItems="center" justifyContent="flex-end" flow={2}>
                  <Button onClick={onClose}>{t('common:close')}</Button>
                  <Button primary>{t('send:steps.confirmation.cta')}</Button>
                </ModalFooter>
              )}
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default compose(connect(mapStateToProps), translate())(SendModal)
