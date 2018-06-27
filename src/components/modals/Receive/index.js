// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

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
import StepReceiveFunds, { StepReceiveFundsFooter } from './steps/04-step-receive-funds'

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
  errorSteps: number[],
}

export type StepProps = DefaultStepProps & {
  device: ?Device,
  account: ?Account,
  closeModal: void => void,
  isAppOpened: boolean,
  isAddressVerified: ?boolean,
  onRetry: void => void,
  onSkipConfirm: void => void,
  onResetSkip: void => void,
  onChangeAccount: (?Account) => void,
  onChangeAppOpened: boolean => void,
  onChangeAddressVerified: boolean => void,
}

const createSteps = ({ t }: { t: T }) => [
  {
    id: 'account',
    label: t('app:receive.steps.chooseAccount.title'),
    component: StepAccount,
    footer: StepAccountFooter,
  },
  {
    id: 'device',
    label: t('app:receive.steps.connectDevice.title'),
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo('account'),
  },
  {
    id: 'confirm',
    label: t('app:receive.steps.confirmAddress.title'),
    component: StepConfirmAddress,
    footer: StepConfirmAddressFooter,
    shouldRenderFooter: ({ isAddressVerified }: StepProps) => isAddressVerified === false,
    shouldPreventClose: ({ isAddressVerified }: StepProps) => isAddressVerified === null,
  },
  {
    id: 'receive',
    label: t('app:receive.steps.receiveFunds.title'),
    component: StepReceiveFunds,
    footer: StepReceiveFundsFooter,
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
  errorSteps: [],
}

class ReceiveModal extends PureComponent<Props, State> {
  state = INITIAL_STATE
  STEPS = createSteps({ t: this.props.t })

  handleBeforeOpenModal = ({ data }) => {
    const { account } = this.state
    const { accounts } = this.props

    if (!account) {
      if (data && data.account) {
        this.setState({ account: data.account })
      } else {
        this.setState({ account: accounts[0] })
      }
    }
  }

  handleRetry = () => this.setState({ isAddressVerified: null, errorSteps: [] })
  handleReset = () => this.setState({ ...INITIAL_STATE })
  handleCloseModal = () => this.props.closeModal(MODAL_RECEIVE)
  handleStepChange = step => this.setState({ stepId: step.id })
  handleChangeAccount = (account: ?Account) => this.setState({ account })
  handleChangeAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened })
  handleChangeAddressVerified = (isAddressVerified: boolean) => {
    if (isAddressVerified) {
      this.setState({ isAddressVerified })
    } else {
      const confirmStepIndex = this.STEPS.findIndex(step => step.id === 'confirm')
      if (confirmStepIndex > -1) {
        this.setState({
          isAddressVerified,
          errorSteps: [confirmStepIndex],
        })
      }
    }
  }

  handleResetSkip = () => this.setState({ disabledSteps: [] })
  handleSkipConfirm = () => {
    const connectStepIndex = this.STEPS.findIndex(step => step.id === 'device')
    const confirmStepIndex = this.STEPS.findIndex(step => step.id === 'confirm')
    if (confirmStepIndex > -1 && connectStepIndex > -1) {
      this.setState({ disabledSteps: [connectStepIndex, confirmStepIndex] })
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
      errorSteps,
    } = this.state

    const addtionnalProps = {
      device,
      account,
      isAppOpened,
      isAddressVerified,
      closeModal: this.handleCloseModal,
      onRetry: this.handleRetry,
      onSkipConfirm: this.handleSkipConfirm,
      onResetSkip: this.handleResetSkip,
      onChangeAccount: this.handleChangeAccount,
      onChangeAppOpened: this.handleChangeAppOpened,
      onChangeAddressVerified: this.handleChangeAddressVerified,
    }

    const isModalLocked = stepId === 'confirm' && isAddressVerified === null

    return (
      <Modal
        name={MODAL_RECEIVE}
        refocusWhenChange={stepId}
        onHide={this.handleReset}
        preventBackdropClick={isModalLocked}
        onBeforeOpen={this.handleBeforeOpenModal}
        render={({ onClose }) => (
          <Fragment>
            <Track onUnmount event="CloseModalReceive" />
            <Stepper
              title={t('app:receive.title')}
              initialStepId={stepId}
              onStepChange={this.handleStepChange}
              onClose={onClose}
              steps={this.STEPS}
              disabledSteps={disabledSteps}
              errorSteps={errorSteps}
              {...addtionnalProps}
            >
              <SyncSkipUnderPriority priority={100} />
            </Stepper>
          </Fragment>
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
