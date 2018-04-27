// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T, Device } from 'types/common'

import { MODAL_RECEIVE } from 'config/constants'

import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'
import Button from 'components/base/Button'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import PrevButton from 'components/modals/PrevButton'
import StepConnectDevice from 'components/modals/StepConnectDevice'

import StepAccount from './01-step-account'
import StepConfirmAddress from './03-step-confirm-address'
import StepReceiveFunds from './04-step-receive-funds'

type Props = {
  t: T,
}

type State = {
  account: Account | null,
  addressVerified: null | boolean,
  amount: string | number,
  appStatus: null | string,
  deviceSelected: Device | null,
  stepIndex: number,
  stepsDisabled: Array<number>,
  stepsErrors: Array<number>,
}

const GET_STEPS = t => [
  { label: t('receive:steps.chooseAccount.title'), Comp: StepAccount },
  { label: t('receive:steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('receive:steps.confirmAddress.title'), Comp: StepConfirmAddress },
  { label: t('receive:steps.receiveFunds.title'), Comp: StepReceiveFunds },
]

const INITIAL_STATE = {
  account: null,
  addressVerified: null,
  amount: '',
  appStatus: null,
  deviceSelected: null,
  stepIndex: 0,
  stepsDisabled: [],
  stepsErrors: [],
}

class ReceiveModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  _steps = GET_STEPS(this.props.t)

  canNext = () => {
    const { account, stepIndex } = this.state

    if (stepIndex === 0) {
      return account !== null
    }

    if (stepIndex === 1) {
      const { deviceSelected, appStatus } = this.state
      return deviceSelected !== null && appStatus === 'success'
    }

    return false
  }

  canClose = () => {
    const { stepIndex, addressVerified } = this.state

    if (stepIndex === 2) {
      return addressVerified === false
    }

    return true
  }

  canPrev = () => {
    const { addressVerified, stepIndex } = this.state

    if (stepIndex === 1) {
      return true
    }

    if (stepIndex === 2) {
      return addressVerified === false
    }

    if (stepIndex === 3) {
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
      addressVerified: null,
      appStatus: null,
      deviceSelected: null,
      stepIndex: newStepIndex,
      stepsDisabled: [],
      stepsErrors: [],
    })
  }

  handleChangeDevice = d => this.setState({ deviceSelected: d })

  handleChangeAccount = account => this.setState({ account })

  handleChangeStatus = (deviceStatus, appStatus) => this.setState({ appStatus })

  handleCheckAddress = isVerified => {
    this.setState({
      addressVerified: isVerified,
      stepsErrors: isVerified === false ? [2] : [],
    })

    if (isVerified === true) {
      this.handleNextStep()
    }
  }

  handleRetryCheckAddress = () =>
    this.setState({
      addressVerified: null,
      stepsErrors: [],
    })

  handleChangeAmount = amount => this.setState({ amount })

  handleBeforeOpenModal = ({ data }) => {
    const { account } = this.state
    if (data && data.account && !account) {
      this.setState({
        account: data.account,
        stepIndex: 1,
      })
    }
  }

  handleSkipStep = () =>
    this.setState({
      addressVerified: false,
      stepsErrors: [],
      stepsDisabled: [1, 2],
      stepIndex: this._steps.length - 1, // last step
    })

  renderStep = () => {
    const { account, amount, addressVerified, deviceSelected, stepIndex } = this.state
    const { t } = this.props
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step

    const props = (predicate, props) => (predicate ? props : {})

    const stepProps = {
      t,
      account,
      ...props(stepIndex === 0, {
        onChangeAccount: this.handleChangeAccount,
      }),
      ...props(stepIndex === 1, {
        accountName: account ? account.name : undefined,
        deviceSelected,
        onChangeDevice: this.handleChangeDevice,
        onStatusChange: this.handleChangeStatus,
      }),
      ...props(stepIndex === 2, {
        addressVerified,
        onCheck: this.handleCheckAddress,
        device: deviceSelected,
      }),
      ...props(stepIndex === 3, {
        addressVerified,
        amount,
        onChangeAmount: this.handleChangeAmount,
        onVerify: this.handlePrevStep,
      }),
    }

    return <Comp {...stepProps} />
  }

  renderButton = () => {
    const { t } = this.props
    const { stepIndex, addressVerified } = this.state

    let onClick
    let props

    switch (stepIndex) {
      case 2:
        props = {
          primary: true,
          onClick: this.handleRetryCheckAddress,
          children: t('common:retry'),
        }
        break
      default:
        onClick = this.handleNextStep
        props = {
          primary: true,
          disabled: !this.canNext(),
          onClick,
          children: t('common:next'),
        }
    }

    return (
      <Fragment>
        {stepIndex === 1 && (
          <Button onClick={this.handleSkipStep} fontSize={4}>
            {t('receive:steps.connectDevice.withoutDevice')}
          </Button>
        )}
        {stepIndex === 2 &&
          addressVerified === false && (
            <Button fontSize={4}>{t('receive:steps.confirmAddress.support')}</Button>
          )}
        <Button {...props} />
      </Fragment>
    )
  }

  render() {
    const { t } = this.props
    const { stepsErrors, stepsDisabled, stepIndex } = this.state

    const canClose = this.canClose()
    const canPrev = this.canPrev()

    return (
      <Modal
        name={MODAL_RECEIVE}
        onBeforeOpen={this.handleBeforeOpenModal}
        onHide={this.handleReset}
        preventBackdropClick={!canClose}
        render={({ onClose }) => (
          <ModalBody onClose={canClose ? onClose : undefined}>
            <ModalTitle>
              {canPrev && <PrevButton onClick={this.handlePrevStep} />}
              {t('receive:title')}
            </ModalTitle>
            <ModalContent>
              <Breadcrumb
                mb={6}
                currentStep={stepIndex}
                stepsErrors={stepsErrors}
                stepsDisabled={stepsDisabled}
                items={this._steps}
              />
              {this.renderStep()}
            </ModalContent>
            {stepIndex !== 3 &&
              canClose && (
                <ModalFooter>
                  <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
                    {this.renderButton()}
                  </Box>
                </ModalFooter>
              )}
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(ReceiveModal)
