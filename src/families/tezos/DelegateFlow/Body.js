// @flow

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'
import invariant from 'invariant'
import sample from 'lodash/sample'
import type { Account, AccountLike, Operation } from '@ledgerhq/live-common/lib/types'
import { useBakers } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import whitelist from '@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import { getMainAccount, addPendingOperation } from '@ledgerhq/live-common/lib/account'
import useBridgeTransaction from '@ledgerhq/live-common/lib/bridge/useBridgeTransaction'
import Track from 'analytics/Track'
import { updateAccountWithUpdater } from 'actions/accounts'
import { MODAL_DELEGATE } from 'config/constants'
import logger from 'logger'
import type { T, Device } from 'types/common'

import { useSignTransactionCallback } from 'helpers/useSignTransaction'
import { getCurrentDevice } from 'reducers/devices'
import { delegatableAccountsSelector } from 'actions/general'
import { closeModal, openModal } from 'reducers/modals'
import { UserRefusedOnDevice } from '@ledgerhq/errors'

import Stepper from 'components/base/Stepper'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import StepAccount, { StepAccountFooter } from './steps/StepAccount'
import StepStarter from './steps/StepStarter'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/StepConnectDevice'
import StepVerification from './steps/StepVerification'
import StepSummary, { StepSummaryFooter } from './steps/StepSummary'
import StepValidator from './steps/StepValidator'
import StepCustom, { StepCustomFooter } from './steps/StepCustom'
import StepConfirmation, { StepConfirmationFooter } from './steps/StepConfirmation'

const createTitles = t => ({
  account: t('delegation.flow.steps.account.title'),
  starter: t('delegation.flow.steps.starter.title'),
  summary: t('delegation.flow.steps.summary.title'),
  validator: t('delegation.flow.steps.validator.title'),
  undelegate: t('delegation.flow.steps.undelegate.title'),
  confirmation: t('delegation.flow.steps.confirmation.title'),
  custom: t('delegation.flow.steps.custom.title'),
})

type OwnProps = {|
  stepId: string,
  onClose: () => void,
  onChangeStepId: string => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    mode: ?string,
    stepId: ?string,
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

const createSteps = params => [
  {
    id: 'starter',
    component: StepStarter,
    excludeFromBreadcrumb: true,
  },
  {
    id: 'account',
    label: <Trans i18nKey="delegation.flow.steps.account.label" />,
    component: StepAccount,
    footer: StepAccountFooter,
    excludeFromBreadcrumb: Boolean(params && params.account),
  },
  {
    id: 'summary',
    label: <Trans i18nKey="delegation.flow.steps.summary.label" />,
    component: StepSummary,
    footer: StepSummaryFooter,
    onBack: params && params.account ? null : ({ transitionTo }) => transitionTo('account'),
  },
  {
    id: 'validator',
    excludeFromBreadcrumb: true,
    component: StepValidator,
    onBack: ({ transitionTo }) => transitionTo('summary'),
  },
  {
    id: 'custom',
    excludeFromBreadcrumb: true,
    component: StepCustom,
    footer: StepCustomFooter,
    // NB do not put a back here. we need to manage back ourself to reset the transaction back in initial state
  },
  {
    id: 'device',
    excludeFromBreadcrumb: true,
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }) => transitionTo('summary'),
  },
  {
    id: 'verification',
    excludeFromBreadcrumb: true,
    component: StepVerification,
    shouldPreventClose: true,
  },
  {
    id: 'refused',
    excludeFromBreadcrumb: true,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
    onBack: ({ transitionTo, onRetry }) => {
      onRetry()
      transitionTo('summary')
    },
  },
  {
    id: 'confirmation',
    label: <Trans i18nKey="delegation.flow.steps.confirmation.label" />,
    component: StepConfirmation,
    footer: StepConfirmationFooter,
  },
]

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: delegatableAccountsSelector, // TODO only tezos accounts not yet delegated
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
  const bakers = useBakers(whitelist)
  const randomBakerIndex = useMemo(() => Math.floor(Math.random() * bakers.length), [bakers.length])
  const randomBaker = bakers[randomBakerIndex]

  const [steps] = useState(() => createSteps(params))
  const {
    transaction,
    setTransaction,
    account,
    parentAccount,
    setAccount,
    status,
    bridgeError,
    bridgePending,
  } = useBridgeTransaction(() => {
    const parentAccount = params && params.parentAccount
    const account = (params && params.account) || accounts[0]
    return {
      account,
      parentAccount,
    }
  })

  // make sure tx is in sync
  useEffect(() => {
    if (!transaction || !account) return
    invariant(transaction.family === 'tezos', 'tezos tx')

    // make sure the mode is in sync (an account changes can reset it)
    const patch: Object = {
      mode: (params && params.mode) || 'delegate',
    }

    // make sure that in delegate mode, a transaction recipient is set (random pick)
    if (patch.mode === 'delegate' && !transaction.recipient && stepId !== 'custom' && randomBaker) {
      patch.recipient = randomBaker.address
    }

    // when changes, we set again
    if (patch.mode !== transaction.mode || 'recipient' in patch) {
      setTransaction(getAccountBridge(account, parentAccount).updateTransaction(transaction, patch))
    }
  }, [account, randomBaker, stepId, params, parentAccount, setTransaction, transaction])

  // make sure step id is in sync
  useEffect(() => {
    const stepId = params && params.stepId
    if (stepId) onChangeStepId(stepId)
  }, [onChangeStepId, params])

  const [isAppOpened, setAppOpened] = useState(false)
  const [optimisticOperation, setOptimisticOperation] = useState(null)
  const [transactionError, setTransactionError] = useState(null)
  const [signed, setSigned] = useState(false)

  const handleCloseModal = useCallback(() => closeModal(MODAL_DELEGATE), [closeModal])

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

  const handleSignTransaction = useSignTransactionCallback({
    context: 'Delegate',
    device,
    account,
    parentAccount,
    handleOperationBroadcasted,
    transaction,
    handleTransactionError,
    setSigned,
  })

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId])

  const titles = useMemo(() => createTitles(t), [t])

  const title =
    transaction && transaction.family === 'tezos' && transaction.mode === 'undelegate'
      ? titles.undelegate
      : titles[stepId] || titles.account

  const errorSteps = []

  if (transactionError) {
    errorSteps.push(2)
  } else if (bridgeError) {
    errorSteps.push(1)
  }

  const isRandomChoice =
    !transaction || !randomBaker || transaction.recipient === randomBaker.address

  const error = transactionError || bridgeError

  const stepperProps = {
    title,
    initialStepId: (params && params.stepId) || stepId,
    openedWithAccount: Boolean(params && params.account),
    steps,
    errorSteps,
    device,
    openedFromAccount,
    account,
    parentAccount,
    transaction,
    isAppOpened,
    hideBreadcrumb:
      stepId === 'starter' ||
      stepId === 'validator' ||
      stepId === 'custom' ||
      stepId === 'confirmation',
    error,
    bridgeError,
    status,
    bridgePending,
    signed,
    optimisticOperation,
    openModal,
    onClose,
    isRandomChoice,
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
      <Track onUnmount event="CloseModalDelegate" />
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
