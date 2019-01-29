// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'
import type { Account, Operation } from '@ledgerhq/live-common/lib/types'

import Track from 'analytics/Track'
import { updateAccountWithUpdater } from 'actions/accounts'
import { MODAL_SEND } from 'config/constants'
import { getBridgeForCurrency } from 'bridge'
import logger from 'logger'

import type { WalletBridge } from 'bridge/types'
import type { T, Device } from 'types/common'
import type { StepProps as DefaultStepProps } from 'components/base/Stepper'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { closeModal, openModal } from 'reducers/modals'
import { DisconnectedDevice, UserRefusedOnDevice } from '@ledgerhq/errors'

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
  openModal: (string, any) => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
}

type State<Transaction> = {
  stepId: string,
  openedFromAccount: boolean,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
  transaction: ?Transaction,
  optimisticOperation: ?Operation,
  isAppOpened: boolean,
  amount: number,
  error: ?Error,
}

export type StepProps<Transaction> = DefaultStepProps & {
  openedFromAccount: boolean,
  device: ?Device,
  account: ?Account,
  bridge: ?WalletBridge<Transaction>,
  transaction: ?Transaction,
  error: ?Error,
  optimisticOperation: ?Operation,
  closeModal: void => void,
  openModal: (string, any) => void,
  isAppOpened: boolean,
  onChangeAccount: (?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeTransaction: Transaction => void,
  onTransactionError: Error => void,
  onOperationBroadcasted: Operation => void,
  onRetry: void => void,
  signTransaction: ({ transitionTo: string => void }) => void,
}

const createSteps = () => [
  {
    id: 'amount',
    label: <Trans i18nKey="send.steps.amount.title" />,
    component: StepAmount,
    footer: StepAmountFooter,
  },
  {
    id: 'device',
    label: <Trans i18nKey="send.steps.connectDevice.title" />,
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }) => transitionTo('amount'),
  },
  {
    id: 'verification',
    label: <Trans i18nKey="send.steps.verification.title" />,
    component: StepVerification,
    shouldPreventClose: true,
  },
  {
    id: 'confirmation',
    label: <Trans i18nKey="send.steps.confirmation.title" />,
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
  openModal,
  updateAccountWithUpdater,
}

const INITIAL_STATE = {
  stepId: 'amount',
  amount: 0,
  openedFromAccount: false,
  account: null,
  bridge: null,
  transaction: null,
  error: null,
  optimisticOperation: null,
  isAppOpened: false,
}

class SendModal extends PureComponent<Props, State<*>> {
  state = INITIAL_STATE

  componentWillUnmount() {
    if (this._signTransactionSub) {
      this._signTransactionSub.unsubscribe()
    }
  }

  STEPS = createSteps()
  _signTransactionSub = null
  _isUnmounted = false

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
      this.setState({
        openedFromAccount: !!(data && data.account),
        account,
        bridge,
        transaction,
      })
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
  handleRetry = () => {
    this.setState({
      error: null,
      optimisticOperation: null,
      isAppOpened: false,
    })
  }

  handleTransactionError = (error: Error) => {
    if (!(error instanceof UserRefusedOnDevice)) {
      logger.critical(error)
    }
    const stepVerificationIndex = this.STEPS.findIndex(step => step.id === 'verification')
    if (stepVerificationIndex === -1) return
    this.setState({ error })
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

  handleSignTransaction = async ({ transitionTo }: { transitionTo: string => void }) => {
    const { device } = this.props
    const { account, transaction, bridge } = this.state

    if (!device) {
      this.handleTransactionError(new DisconnectedDevice())
      transitionTo('confirmation')
      return
    }

    invariant(account && transaction && bridge, 'signTransaction invalid conditions')

    this._signTransactionSub = bridge
      .signAndBroadcast(account, transaction, device.path)
      .subscribe({
        next: e => {
          switch (e.type) {
            case 'signed': {
              if (this._isUnmounted) return
              transitionTo('confirmation')
              break
            }
            case 'broadcasted': {
              this.handleOperationBroadcasted(e.operation)
              break
            }
            default:
          }
        },
        error: err => {
          const error = err.statusCode === 0x6985 ? new UserRefusedOnDevice() : err
          this.handleTransactionError(error)
          transitionTo('confirmation')
        },
      })
  }

  render() {
    const { t, device, openModal } = this.props
    const {
      stepId,
      openedFromAccount,
      account,
      isAppOpened,
      bridge,
      transaction,
      optimisticOperation,
      error,
    } = this.state

    const addtionnalProps = {
      device,
      openedFromAccount,
      account,
      bridge,
      transaction,
      isAppOpened,
      error,
      optimisticOperation,
      openModal,
      closeModal: this.handleCloseModal,
      onChangeAccount: this.handleChangeAccount,
      onChangeAppOpened: this.handleChangeAppOpened,
      onChangeTransaction: this.handleChangeTransaction,
      onRetry: this.handleRetry,
      signTransaction: this.handleSignTransaction,
    }

    const errorSteps = error ? [error instanceof UserRefusedOnDevice ? 2 : 3] : []

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
            title={t('send.title')}
            initialStepId={stepId}
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
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
