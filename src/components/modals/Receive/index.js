// @flow

import React, { Fragment, PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import { accountsSelector } from 'reducers/accounts'

import type { Account } from '@ledgerhq/live-common/lib/types'
import type { T, Device } from 'types/common'

import { MODAL_RECEIVE } from 'config/constants'
import { isSegwitAccount } from 'helpers/bip32'

import getAddress from 'commands/getAddress'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'
import SyncOneAccountOnMount from 'components/SyncOneAccountOnMount'

import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'
import Button from 'components/base/Button'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import { WrongDeviceForAccount } from 'components/EnsureDeviceApp'
import StepConnectDevice from 'components/modals/StepConnectDevice'

import StepAccount from './01-step-account'
import StepConfirmAddress from './03-step-confirm-address'
import StepReceiveFunds from './04-step-receive-funds'

type Props = {
  t: T,
  accounts: Account[],
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
  { label: t('app:receive.steps.chooseAccount.title'), Comp: StepAccount },
  { label: t('app:receive.steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('app:receive.steps.confirmAddress.title'), Comp: StepConfirmAddress },
  { label: t('app:receive.steps.receiveFunds.title'), Comp: StepReceiveFunds },
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
  // FIXME the two above can be derivated from other info (if we keep error etc)
  // we can get rid of it after a big refactoring (see how done in Send)
}

const mapStateToProps = createStructuredSelector({
  accounts: accountsSelector,
})

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

    // TODO: do that better
    if (stepIndex === 1) {
      this.verifyAddress()
    }
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

  handleRetryCheckAddress = () => {
    this.setState({
      addressVerified: null,
      stepsErrors: [],
    })

    // TODO: do that better
    this.verifyAddress()
  }

  handleChangeAmount = amount => this.setState({ amount })

  handleBeforeOpenModal = ({ data }) => {
    const { account } = this.state
    const { accounts } = this.props

    if (!account) {
      if (data && data.account) {
        this.setState({
          account: data.account,
          stepIndex: 1,
        })
      } else {
        this.setState({
          account: accounts[0],
        })
      }
    }
  }

  handleSkipStep = () =>
    this.setState({
      addressVerified: false,
      stepsErrors: [],
      stepsDisabled: [1, 2],
      stepIndex: this._steps.length - 1, // last step
    })

  verifyAddress = async () => {
    const { account, deviceSelected: device } = this.state
    try {
      if (account && device) {
        const { address } = await getAddress
          .send({
            currencyId: account.currency.id,
            devicePath: device.path,
            path: account.freshAddressPath,
            segwit: isSegwitAccount(account),
            verify: true,
          })
          .toPromise()

        if (address !== account.freshAddress) {
          throw new WrongDeviceForAccount(`WrongDeviceForAccount ${account.name}`, {
            accountName: account.name,
          })
        }

        this.handleCheckAddress(true)
      } else {
        this.handleCheckAddress(false)
      }
    } catch (err) {
      this.handleCheckAddress(false)
    }
  }

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
          children: t('app:common.retry'),
        }
        break
      default:
        onClick = this.handleNextStep
        props = {
          primary: true,
          disabled: !this.canNext(),
          onClick,
          children: t('app:common.next'),
        }
    }

    return (
      <Fragment>
        {stepIndex === 1 && (
          <Button onClick={this.handleSkipStep} fontSize={4}>
            {t('app:receive.steps.connectDevice.withoutDevice')}
          </Button>
        )}
        {stepIndex === 2 &&
          addressVerified === false && (
            <Button fontSize={4}>{t('app:receive.steps.confirmAddress.support')}</Button>
          )}
        <Button {...props} />
      </Fragment>
    )
  }

  render() {
    const { t } = this.props
    const { stepsErrors, stepsDisabled, stepIndex, account } = this.state

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
            <SyncSkipUnderPriority priority={9} />
            {account && <SyncOneAccountOnMount priority={10} accountId={account.id} />}
            <ModalTitle onBack={canPrev ? this.handlePrevStep : undefined}>
              {t('app:receive.title')}
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

export default compose(
  connect(mapStateToProps),
  translate(),
)(ReceiveModal)
