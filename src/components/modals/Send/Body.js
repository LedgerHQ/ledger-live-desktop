// @flow

import React, { useEffect, useState, useRef, useCallback } from 'react'
import invariant from 'invariant'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'
import type { Account, AccountLike, Operation } from '@ledgerhq/live-common/lib/types'
import { getMainAccount, addPendingOperation } from '@ledgerhq/live-common/lib/account'
import useBridgeTransaction from '@ledgerhq/live-common/lib/bridge/useBridgeTransaction'
import Track from 'analytics/Track'
import { updateAccountWithUpdater } from 'actions/accounts'
import { MODAL_SEND } from 'config/constants'
import logger from 'logger'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import type { T, Device } from 'types/common'
import { track } from 'analytics/segment'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { closeModal, openModal } from 'reducers/modals'
import { DisconnectedDevice, UserRefusedOnDevice } from '@ledgerhq/errors'

import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import StepAmount, { StepAmountFooter } from './steps/01-step-amount'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepVerification from './steps/03-step-verification'
import StepConfirmation, { StepConfirmationFooter } from './steps/04-step-confirmation'

type OwnProps = {|
  stepId: string,
  onClose: () => void,
  onChangeStepId: string => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
  },
|}

type StateProps = {|
  t: T,
  device: ?Device,
  accounts: Account[],
  closeModal: string => void,
  openModal: (string, any) => void,
  updateAccountWithUpdater: (string, (Account) => Account) => void,
|}

type Props = {|
  ...OwnProps,
  ...StateProps,
|}

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

const Body = ({
  t,
  device,
  openModal,
  closeModal,
  onChangeStepId,
  onClose,
  stepId,
  params,
  accounts,
  updateAccountWithUpdater,
}: Props) => {
  const openedFromAccount = !!params.account
  const [steps] = useState(createSteps)
  const {
    transaction,
    setTransaction,
    account,
    parentAccount,
    setAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction()

  const [isAppOpened, setAppOpened] = useState(false)
  const [optimisticOperation, setOptimisticOperation] = useState(null)
  const [transactionError, setTransactionError] = useState(null)
  const [signed, setSigned] = useState(false)
  const signTransactionSubRef = useRef(null)

  const handleCloseModal = useCallback(() => closeModal(MODAL_SEND), [closeModal])

  const handleChangeAccount = useCallback(
    (nextAccount: AccountLike, nextParentAccount: ?Account) => {
      if (account !== nextAccount) {
        setAccount(nextAccount, nextParentAccount)
      }
    },
    [account, setAccount],
  )

  const handleRetry = useCallback(() => {
    setTransactionError(null)
    setOptimisticOperation(null)
    setAppOpened(false)
    setSigned(false)
  }, [])

  const handleTransactionError = useCallback(
    (error: Error) => {
      if (!(error instanceof UserRefusedOnDevice)) {
        logger.critical(error)
      }
      const stepVerificationIndex = steps.findIndex(step => step.id === 'verification')
      if (stepVerificationIndex === -1) return
      setTransactionError(error)
    },
    [steps],
  )

  const handleOperationBroadcasted = useCallback(
    (optimisticOperation: Operation) => {
      if (!account) return
      const mainAccount = getMainAccount(account, parentAccount)
      updateAccountWithUpdater(mainAccount.id, account =>
        addPendingOperation(account, optimisticOperation),
      )
      setOptimisticOperation(optimisticOperation)
      setTransactionError(null)
    },
    [account, parentAccount, updateAccountWithUpdater],
  )

  const handleSignTransaction = useCallback(
    async ({ transitionTo }: { transitionTo: string => void }) => {
      if (!account) return
      const mainAccount = getMainAccount(account, parentAccount)
      const bridge = getAccountBridge(account, parentAccount)
      if (!device) {
        handleTransactionError(new DisconnectedDevice())
        transitionTo('confirmation')
        return
      }

      invariant(account && transaction && bridge, 'signTransaction invalid conditions')

      const eventProps = {
        currencyName: mainAccount.currency.name,
        derivationMode: mainAccount.derivationMode,
        freshAddressPath: mainAccount.freshAddressPath,
        operationsLength: mainAccount.operations.length,
      }
      track('SendTransactionStart', eventProps)
      signTransactionSubRef.current = bridge
        .signAndBroadcast(mainAccount, transaction, device.path)
        .subscribe({
          next: e => {
            switch (e.type) {
              case 'signed': {
                track('SendTransactionSigned', eventProps)
                setSigned(true)
                transitionTo('confirmation')
                break
              }
              case 'broadcasted': {
                track('SendTransactionBroadcasted', eventProps)
                handleOperationBroadcasted(e.operation)
                break
              }
              default:
            }
          },
          error: err => {
            const error = err.statusCode === 0x6985 ? new UserRefusedOnDevice() : err
            track(
              error instanceof UserRefusedOnDevice
                ? 'SendTransactionRefused'
                : 'SendTransactionError',
              eventProps,
            )
            handleTransactionError(error)
            transitionTo('confirmation')
          },
        })
    },
    [
      device,
      account,
      parentAccount,
      handleOperationBroadcasted,
      transaction,
      handleTransactionError,
    ],
  )

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId])

  // only call on mount/unmount
  useEffect(() => {
    const parentAccount = params && params.parentAccount
    const account = (params && params.account) || accounts[0]
    setAccount(account, parentAccount)
    return () => {
      if (signTransactionSubRef.current) {
        signTransactionSubRef.current.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const errorSteps = []

  if (transactionError) {
    if (transactionError instanceof UserRefusedOnDevice) {
      errorSteps.push(2)
    } else {
      errorSteps.push(3)
    }
  } else if (bridgeError) {
    errorSteps.push(0)
  }

  const error = transactionError || bridgeError

  const stepperProps = {
    title: t('send.title'),
    initialStepId: stepId,
    steps,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    isAppOpened,
    hideBreadcrumb: !!error && stepId === 'amount',
    error,
    status,
    bridgePending,
    signed,
    optimisticOperation,
    openModal,
    onClose,
    closeModal: handleCloseModal,
    onChangeAccount: handleChangeAccount,
    onChangeAppOpened: setAppOpened,
    onChangeTransaction: setTransaction,
    onRetry: handleRetry,
    signTransaction: handleSignTransaction,
    onStepChange: handleStepChange,
  }

  if (!status) return null

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalSend" />
    </Stepper>
  )
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(Body)
