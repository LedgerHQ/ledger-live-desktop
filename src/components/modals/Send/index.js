// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'

import Track from 'analytics/Track'
import { updateAccountWithUpdater } from 'actions/accounts'
import { MODAL_SEND } from 'config/constants'
import { getBridgeForCurrency } from 'bridge'

import type { WalletBridge } from 'bridge/types'
import type { T, Device } from 'types/common'
import type { StepProps as DefaultStepProps } from 'components/base/Stepper'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { closeModal } from 'reducers/modals'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import StepAmount, { StepAmountFooter } from './steps/01-step-amount'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepVerification from './steps/03-step-verification'
import StepConfirmation, { StepConfirmationFooter } from './steps/04-step-confirmation'

type Props = {
  t: T,
  device: ?Device,
  accounts: Account[],
  closeModal: string => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
}

type State<Transaction> = {
  stepId: string,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
  transaction: ?Transaction,
  optimisticOperation: ?Operation,
  isAppOpened: boolean,
  disabledSteps: number[],
  errorSteps: number[],
  amount: number,
  error: ?Error,
}

export type StepProps<Transaction> = DefaultStepProps & {
  device: ?Device,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
  transaction: ?Transaction,
  error: ?Error,
  optimisticOperation: ?Operation,
  closeModal: void => void,
  isAppOpened: boolean,
  onChangeAccount: (?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  onRetry: void => void,
}

const createSteps = ({ t }: { t: T }) => [
  {
    id: 'amount',
    label: t('app:send.steps.amount.title'),
    component: StepAmount,
    footer: StepAmountFooter,
  },
  {
    id: 'device',
    label: t('app:send.steps.connectDevice.title'),
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }) => transitionTo('amount'),
  },
  {
    id: 'verification',
    label: t('app:send.steps.verification.title'),
    component: StepVerification,
    shouldPreventClose: true,
  },
  {
    id: 'confirmation',
    label: t('app:send.steps.confirmation.title'),
    component: StepConfirmation,
    footer: StepConfirmationFooter,
    onBack: ({ transitionTo, onRetry }) => {
      onRetry()
      transitionTo('amount')
    },
  },
]

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  closeModal,
  updateAccountWithUpdater,
}

const INITIAL_STATE = {
  stepId: 'amount',
  amount: 0,
  account: null,
  bridge: null,
  transaction: null,
  error: null,
  optimisticOperation: null,
  isAppOpened: false,
  disabledSteps: [],
  errorSteps: [],
}

class SendModal extends PureComponent<Props, State<*>> {
  state = INITIAL_STATE
  STEPS = createSteps({ t: this.props.t })

  handleReset = () => this.setState({ ...INITIAL_STATE })

  handleCloseModal = () => this.props.closeModal(MODAL_SEND)
  handleStepChange = step => this.setState({ stepId: step.id })

  handleBeforeOpenModal = ({ data }) => {
    const { account } = this.state
    const { accounts } = this.props
    if (!account) {
      const account = (data && data.account) || accounts[0]
      const bridge = account ? getBridgeForCurrency(account.currency) : null
      const transaction = bridge ? bridge.createTransaction(account) : null
      this.setState({ account, bridge, transaction })
    }
  }

  handleChangeAccount = (account: Account) => {
    if (account !== this.state.account) {
      const bridge = getBridgeForCurrency(account.currency)
      const transaction = bridge.createTransaction(account)
      this.setState({ account, bridge, transaction })
    }
  }

  handleChangeAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened })
  handleChangeTransaction = transaction => this.setState({ transaction })
  handleRetry = () => this.setState({ error: null, errorSteps: [] })

  handleTransactionError = (error: Error) => {
    const stepVerificationIndex = this.STEPS.findIndex(step => step.id === 'verification')
    if (stepVerificationIndex === -1) return
    this.setState({ error, errorSteps: [stepVerificationIndex] })
  }

  handleOperationBroadcasted = (optimisticOperation: Operation) => {
    const { account, bridge } = this.state
    const { updateAccountWithUpdater } = this.props
    if (!account || !bridge) return
    const { addPendingOperation } = bridge
    if (addPendingOperation) {
      updateAccountWithUpdater(account.id, account =>
        addPendingOperation(account, optimisticOperation),
      )
    }
    this.setState({ optimisticOperation, error: null })
  }

  render() {
    const { t, device } = this.props
    const {
      stepId,
      account,
      isAppOpened,
      disabledSteps,
      errorSteps,
      bridge,
      transaction,
      optimisticOperation,
      error,
    } = this.state

    const addtionnalProps = {
      device,
      account,
      bridge,
      transaction,
      isAppOpened,
      error,
      optimisticOperation,
      closeModal: this.handleCloseModal,
      onChangeAccount: this.handleChangeAccount,
      onChangeAppOpened: this.handleChangeAppOpened,
      onChangeTransaction: this.handleChangeTransaction,
      onTransactionError: this.handleTransactionError,
      onRetry: this.handleRetry,
      onOperationBroadcasted: this.handleOperationBroadcasted,
    }

    const isModalLocked = stepId === 'verification'

    return (
      <Modal
        name={MODAL_SEND}
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        onBeforeOpen={this.handleBeforeOpenModal}
        render={({ onClose }) => (
          <Stepper
            title={t('app:send.title')}
            initialStepId={stepId}
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
            disabledSteps={disabledSteps}
            errorSteps={errorSteps}
            {...addtionnalProps}
          >
            <SyncSkipUnderPriority priority={100} />
            <Track onUnmount event="CloseModalSend" />
          </Stepper>
        )}
      />
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(SendModal)
