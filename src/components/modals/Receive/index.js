// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import logger from 'logger'
import Track from 'analytics/Track'
import type { Account } from '@ledgerhq/live-common/lib/types'

import { MODAL_RECEIVE } from 'config/constants'
import type { T, Device } from 'types/common'
import type { StepProps as DefaultStepProps } from 'components/base/Stepper'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { closeModal } from 'reducers/modals'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'

import StepAccount, { StepAccountFooter } from './steps/01-step-account'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepConfirmAddress, { StepConfirmAddressFooter } from './steps/03-step-confirm-address'
import StepReceiveFunds from './steps/04-step-receive-funds'

type Props = {
  t: T,
  device: ?Device,
  accounts: Account[],
  closeModal: string => void,
}

type State = {
  stepId: string,
  account: ?Account,
  isAppOpened: boolean,
  isAddressVerified: ?boolean,
  disabledSteps: number[],
  verifyAddressError: ?Error,
}

export type StepProps = DefaultStepProps & {
  device: ?Device,
  account: ?Account,
  closeModal: void => void,
  isAppOpened: boolean,
  isAddressVerified: ?boolean,
  verifyAddressError: ?Error,
  onRetry: void => void,
  onSkipConfirm: void => void,
  onResetSkip: void => void,
  onChangeAccount: (?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeAddressVerified: (?boolean, ?Error) => void,
}

const createSteps = () => [
  {
    id: 'account',
    label: <Trans i18nKey="receive.steps.chooseAccount.title" />,
    component: StepAccount,
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

const INITIAL_STATE = {
  stepId: 'account',
  account: null,
  isAppOpened: false,
  isAddressVerified: null,
  disabledSteps: [],
  verifyAddressError: null,
}

class ReceiveModal extends PureComponent<Props, State> {
  state = INITIAL_STATE
  STEPS = createSteps()

  handleBeforeOpenModal = ({ data }) => {
    const { account } = this.state
    const { accounts } = this.props

    if (!account) {
      if (data && data.account) {
        this.setState({ account: data.account, stepId: 'device' })
      } else {
        this.setState({ account: accounts[0] })
      }
    }
  }

  handleRetry = () =>
    this.setState({
      verifyAddressError: null,
      isAddressVerified: null,
      isAppOpened: false,
    })

  handleReset = () => this.setState({ ...INITIAL_STATE })

  handleCloseModal = () => this.props.closeModal(MODAL_RECEIVE)

  handleStepChange = step => this.setState({ stepId: step.id })

  handleChangeAccount = (account: ?Account) => this.setState({ account })

  handleChangeAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened })

  handleChangeAddressVerified = (isAddressVerified: boolean, err: ?Error) => {
    if (err && err.name !== 'UserRefusedAddress') {
      logger.critical(err)
    }
    this.setState({ isAddressVerified, verifyAddressError: err })
  }

  handleResetSkip = () => this.setState({ disabledSteps: [] })

  handleSkipConfirm = () => {
    const connectStepIndex = this.STEPS.findIndex(step => step.id === 'device')
    const confirmStepIndex = this.STEPS.findIndex(step => step.id === 'confirm')
    if (confirmStepIndex > -1 && connectStepIndex > -1) {
      this.setState({
        isAddressVerified: false,
        verifyAddressError: null,
        disabledSteps: [connectStepIndex, confirmStepIndex],
      })
    }
  }

  render() {
    const { t, device } = this.props
    const {
      stepId,
      account,
      isAppOpened,
      isAddressVerified,
      disabledSteps,
      verifyAddressError,
    } = this.state

    const addtionnalProps = {
      device,
      account,
      isAppOpened,
      isAddressVerified,
      verifyAddressError,
      closeModal: this.handleCloseModal,
      onRetry: this.handleRetry,
      onSkipConfirm: this.handleSkipConfirm,
      onResetSkip: this.handleResetSkip,
      onChangeAccount: this.handleChangeAccount,
      onChangeAppOpened: this.handleChangeAppOpened,
      onChangeAddressVerified: this.handleChangeAddressVerified,
    }

    const errorSteps = verifyAddressError
      ? [verifyAddressError.name === 'UserRefusedAddress' ? 2 : 3]
      : []

    const isModalLocked = stepId === 'receive' && isAddressVerified === null

    return (
      <Modal
        name={MODAL_RECEIVE}
        centered
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        onBeforeOpen={this.handleBeforeOpenModal}
        render={() => (
          <Stepper
            title={t('receive.title')}
            initialStepId={stepId}
            onStepChange={this.handleStepChange}
            onClose={addtionnalProps.closeModal}
            steps={this.STEPS}
            disabledSteps={disabledSteps}
            errorSteps={errorSteps}
            {...addtionnalProps}
          >
            <Track onUnmount event="CloseModalReceive" />
            <SyncSkipUnderPriority priority={100} />
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
)(ReceiveModal)
