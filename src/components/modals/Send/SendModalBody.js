// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T, Device } from 'types/common'
import type { WalletBridge } from 'bridge/types'
import { getBridgeForCurrency } from 'bridge'

import { getVisibleAccounts } from 'reducers/accounts'

import Breadcrumb from 'components/Breadcrumb'
import { ModalBody, ModalTitle, ModalContent } from 'components/base/Modal'
import PrevButton from 'components/modals/PrevButton'
import StepConnectDevice from 'components/modals/StepConnectDevice'
import ChildSwitch from 'components/base/ChildSwitch'

import Footer from './Footer'
import ConfirmationFooter from './ConfirmationFooter'

import StepAmount from './01-step-amount'
import StepVerification from './03-step-verification'
import StepConfirmation from './04-step-confirmation'

type Props = {
  initialAccount: ?Account,
  onClose: () => void,
  accounts: Account[],
  t: T,
}

type State<T> = {
  account: Account,
  transaction: ?T,
  bridge: ?WalletBridge<T>,
  stepIndex: number,
  appStatus: ?string,
  deviceSelected: ?Device,
  txValidated: ?string,
}

type Step = {
  label: string,
  canNext?: (State<*>) => boolean,
  prevStep?: number,
}

const mapStateToProps = createStructuredSelector({
  accounts: getVisibleAccounts,
})

class SendModalBody extends PureComponent<Props, State<*>> {
  constructor({ t, initialAccount, accounts }: Props) {
    super()
    const account = initialAccount || accounts[0]
    const bridge = account ? getBridgeForCurrency(account.currency) : null
    const transaction = bridge ? bridge.createTransaction(account) : null
    this.state = {
      stepIndex: 0,
      txOperation: null,
      appStatus: null,
      deviceSelected: null,
      txValidated: null,
      account,
      bridge,
      transaction,
    }

    this.steps = [
      {
        label: t('send:steps.amount.title'),
        canNext: ({ bridge, account, transaction }) =>
          bridge && account && transaction
            ? bridge.isValidTransaction(account, transaction)
            : false,
      },
      {
        label: t('send:steps.connectDevice.title'),
        canNext: ({ deviceSelected, appStatus }) =>
          deviceSelected !== null && appStatus === 'success',
        prevStep: 0,
      },
      {
        label: t('send:steps.verification.title'),
        canNext: () => true,
        prevStep: 1,
      },
      {
        label: t('send:steps.confirmation.title'),
        prevStep: 1,
      },
    ]
  }

  onNextStep = () =>
    this.setState(({ stepIndex }) => {
      if (stepIndex >= this.steps.length - 1) {
        return null
      }
      return { stepIndex: stepIndex + 1 }
    })

  onChangeDevice = (deviceSelected: ?Device) => {
    this.setState({ deviceSelected })
  }

  onChangeStatus = (deviceStatus: ?string, appStatus: ?string) => {
    this.setState({ appStatus })
  }

  onPrevStep = () => {
    const { stepIndex } = this.state
    const step = this.steps[stepIndex]
    if (step && 'prevStep' in step) {
      this.setState({
        appStatus: null,
        deviceSelected: null,
        stepIndex: step.prevStep,
      })
    }
  }

  onValidate = (txid: ?string) => {
    const { stepIndex } = this.state
    this.setState({
      txValidated: txid,
      stepIndex: stepIndex + 1,
    })
  }

  onChangeAccount = account => {
    const bridge = getBridgeForCurrency(account.currency)
    this.setState({
      account,
      bridge,
      transaction: bridge.createTransaction(account),
    })
  }

  onChangeTransaction = transaction => {
    this.setState({ transaction })
  }

  onGoToFirstStep = () => {
    this.setState({ stepIndex: 0 })
  }

  steps: Step[]

  render() {
    const { t, onClose } = this.props
    const { stepIndex, account, transaction, bridge, txValidated, deviceSelected } = this.state

    const step = this.steps[stepIndex]
    if (!step) return null
    const canNext = step.canNext && step.canNext(this.state)
    const canPrev = 'prevStep' in step

    return (
      <ModalBody onClose={onClose}>
        <ModalTitle>
          {canPrev && <PrevButton onClick={this.onPrevStep} />}
          {t('send:title')}
        </ModalTitle>

        <ModalContent>
          <Breadcrumb t={t} mb={6} currentStep={stepIndex} items={this.steps} />

          <ChildSwitch index={stepIndex}>
            <StepAmount
              t={t}
              account={account}
              bridge={bridge}
              transaction={transaction}
              onChangeAccount={this.onChangeAccount}
              onChangeTransaction={this.onChangeTransaction}
            />

            <StepConnectDevice
              t={t}
              account={account}
              accountName={account && account.name}
              deviceSelected={deviceSelected}
              onChangeDevice={this.onChangeDevice}
              onStatusChange={this.onChangeStatus}
            />

            <StepVerification
              t={t}
              account={account}
              bridge={bridge}
              transaction={transaction}
              device={deviceSelected}
              onValidate={this.onValidate}
            />

            <StepConfirmation t={t} txValidated={txValidated} />
          </ChildSwitch>
        </ModalContent>

        {stepIndex === 3 ? (
          <ConfirmationFooter
            t={t}
            txValidated={txValidated}
            onClose={onClose}
            onGoToFirstStep={this.onGoToFirstStep}
          />
        ) : (
          account &&
          bridge &&
          transaction &&
          stepIndex < 2 && (
            <Footer
              canNext={canNext}
              onNext={this.onNextStep}
              account={account}
              bridge={bridge}
              transaction={transaction}
              showTotal={stepIndex === 0}
              t={t}
            />
          )
        )}
      </ModalBody>
    )
  }
}

export default compose(connect(mapStateToProps), translate())(SendModalBody)
