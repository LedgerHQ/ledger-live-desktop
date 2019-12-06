// @flow
import React, { useState, useCallback, useEffect } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import Track from 'analytics/Track'
import type {
  Account,
  TokenAccount,
  TokenCurrency,
  AccountLike,
} from '@ledgerhq/live-common/lib/types'

import { MODAL_RECEIVE } from 'config/constants'
import type { T, Device } from 'types/common'
import type { StepProps as DefaultStepProps } from 'components/base/Stepper'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { closeModal } from 'reducers/modals'

import Stepper from 'components/base/Stepper'

import StepAccount, { StepAccountFooter } from './steps/StepAccount'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/StepConnectDevice'
import StepConfirmAddress, { StepConfirmAddressFooter } from './steps/StepConfirmAddress'
import StepWarning, { StepWarningFooter } from './steps/StepWarning'
import StepReceiveFunds from './steps/StepReceiveFunds'

type OwnProps = {|
  stepId: string,
  onClose: () => void,
  onChangeStepId: string => void,
  isAddressVerified: ?boolean,
  verifyAddressError: ?Error,
  onChangeAddressVerified: (isAddressVerified: boolean, err: ?Error) => void,
  params: {
    account: ?AccountLike,
    parentAccount: ?Account,
    startWithWarning?: boolean,
    receiveTokenMode?: boolean,
  },
|}

type StateProps = {|
  t: T,
  device: ?Device,
  accounts: Account[],
  device: ?Device,
  closeModal: string => void,
|}

type Props = {|
  ...OwnProps,
  ...StateProps,
|}

export type StepProps = DefaultStepProps & {
  device: ?Device,
  account: ?(Account | TokenAccount),
  parentAccount: ?Account,
  token: ?TokenCurrency,
  receiveTokenMode: boolean,
  closeModal: void => void,
  isAppOpened: boolean,
  isAddressVerified: ?boolean,
  verifyAddressError: ?Error,
  onRetry: void => void,
  onSkipConfirm: void => void,
  onResetSkip: void => void,
  onChangeToken: (token: ?TokenCurrency) => void,
  onChangeAccount: (account: ?(Account | TokenAccount), tokenAccount: ?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeAddressVerified: (?boolean, ?Error) => void,
}

const createSteps = () => [
  {
    id: 'warning',
    excludeFromBreadcrumb: true,
    component: StepWarning,
    footer: StepWarningFooter,
  },
  {
    id: 'account',
    label: <Trans i18nKey="receive.steps.chooseAccount.title" />,
    component: StepAccount,
    noScroll: true,
    footer: StepAccountFooter,
  },
  {
    id: 'device',
    label: <Trans i18nKey="receive.steps.connectDevice.title" />,
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo('account'),
  },
  {
    id: 'confirm',
    label: <Trans i18nKey="receive.steps.confirmAddress.title" />,
    footer: StepConfirmAddressFooter,
    component: StepConfirmAddress,
    onBack: ({ transitionTo }: StepProps) => transitionTo('device'),
    shouldRenderFooter: ({ isAddressVerified }: StepProps) => isAddressVerified === false,
  },
  {
    id: 'receive',
    label: <Trans i18nKey="receive.steps.receiveFunds.title" />,
    component: StepReceiveFunds,
    shouldPreventClose: ({ isAddressVerified }: StepProps) => isAddressVerified === null,
  },
]

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
})

const mapDispatchToProps = {
  closeModal,
}

const Body = ({
  t,
  stepId,
  device,
  accounts,
  closeModal,
  onChangeStepId,
  isAddressVerified,
  verifyAddressError,
  onChangeAddressVerified,
  params,
}: Props) => {
  const [steps] = useState(createSteps)
  const [account, setAccount] = useState(() => (params && params.account) || accounts[0])
  const [parentAccount, setParentAccount] = useState(() => params && params.parentAccount)
  const [disabledSteps, setDisabledSteps] = useState([])
  const [isAppOpened, setAppOpened] = useState(false)
  const [token, setToken] = useState(null)

  const handleChangeAccount = useCallback(
    (account, parentAccount) => {
      setAccount(account)
      setParentAccount(parentAccount)
    },
    [setParentAccount, setAccount],
  )

  const handleCloseModal = useCallback(() => {
    closeModal(MODAL_RECEIVE)
  }, [closeModal])

  const handleStepChange = useCallback(e => onChangeStepId(e.id), [onChangeStepId])

  const handleResetSkip = useCallback(() => {
    setDisabledSteps([])
  }, [setDisabledSteps])

  const handleRetry = useCallback(() => {
    onChangeAddressVerified(null, null)
    setAppOpened(false)
  }, [onChangeAddressVerified, setAppOpened])

  const handleSkipConfirm = useCallback(() => {
    const connectStepIndex = steps.findIndex(step => step.id === 'device')
    const confirmStepIndex = steps.findIndex(step => step.id === 'confirm')
    if (confirmStepIndex > -1 && connectStepIndex > -1) {
      onChangeAddressVerified(false, null)
      setDisabledSteps([connectStepIndex, confirmStepIndex])
    }
  }, [onChangeAddressVerified, setDisabledSteps, steps])

  useEffect(() => {
    const stepId =
      params && params.startWithWarning ? 'warning' : params.receiveTokenMode ? 'account' : null
    if (stepId) onChangeStepId(stepId)
  }, [onChangeStepId, params])

  useEffect(() => {
    if (!account) {
      if (!params && params.account) {
        handleChangeAccount(params.account, params.parentAccount)
      } else {
        handleChangeAccount(accounts[0], null)
      }
    }
  }, [accounts, account, params, handleChangeAccount])

  const errorSteps = verifyAddressError
    ? [verifyAddressError.name === 'UserRefusedAddress' ? 2 : 3]
    : []

  const stepperProps = {
    title: stepId === 'warning' ? t('common.information') : t('receive.title'),
    device,
    account,
    parentAccount,
    initialStepId: params && params.startWithWarning ? 'warning' : stepId,
    steps,
    errorSteps,
    disabledSteps,
    receiveTokenMode: !!params.receiveTokenMode,
    hideBreadcrumb: stepId === 'warning',
    token,
    isAppOpened,
    isAddressVerified,
    verifyAddressError,
    closeModal: handleCloseModal,
    onRetry: handleRetry,
    onSkipConfirm: handleSkipConfirm,
    onResetSkip: handleResetSkip,
    onChangeAccount: handleChangeAccount,
    onChangeToken: setToken,
    onChangeAppOpened: setAppOpened,
    onChangeAddressVerified,
    onStepChange: handleStepChange,
    onClose: handleCloseModal,
  }

  return (
    <Stepper {...stepperProps}>
      <SyncSkipUnderPriority priority={100} />
      <Track onUnmount event="CloseModalReceive" />
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
