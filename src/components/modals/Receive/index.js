// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import get from 'lodash/get'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { T, Device } from 'types/common'

import { MODAL_RECEIVE } from 'config/constants'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Breadcrumb from 'components/Breadcrumb'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import StepConnectDevice from 'components/modals/StepConnectDevice'

import StepAccount from './01-step-account'

type Props = {
  t: T,
}

type State = {
  account: Account | null,
  deviceSelected: Device | null,
  appStatus: null | string,
  stepIndex: number,
}

const GET_STEPS = t => [
  { label: t('receive:steps.chooseAccount.title'), Comp: StepAccount },
  { label: t('receive:steps.connectDevice.title'), Comp: StepConnectDevice },
]

const INITIAL_STATE = {
  account: null,
  deviceSelected: null,
  appStatus: null,
  stepIndex: 0,
}

class ReceiveModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  _steps = GET_STEPS(this.props.t)

  canNext = acc => {
    const { stepIndex } = this.state

    if (stepIndex === 0) {
      return acc !== null
    }

    if (stepIndex === 1) {
      const { deviceSelected, appStatus } = this.state
      return deviceSelected !== null && appStatus === 'success'
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

  handleChangeDevice = d => this.setState({ deviceSelected: d })

  handleChangeAccount = account => this.setState({ account })

  handleChangeStatus = (deviceStatus, appStatus) => this.setState({ appStatus })

  renderStep = acc => {
    const { deviceSelected, stepIndex } = this.state
    const { t } = this.props
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step

    const props = (predicate, props) => (predicate ? props : {})

    const stepProps = {
      t,
      account: acc,
      ...props(stepIndex === 0, {
        onChangeAccount: this.handleChangeAccount,
      }),
      ...props(stepIndex === 1, {
        accountName: acc ? acc.name : undefined,
        deviceSelected,
        onChangeDevice: this.handleChangeDevice,
        onStatusChange: this.handleChangeStatus,
      }),
    }

    return <Comp {...stepProps} />
  }

  renderButton = acc => {
    const { t } = this.props
    const { stepIndex } = this.state

    let onClick

    switch (stepIndex) {
      default:
        onClick = this.handleNextStep
    }

    const props = {
      primary: true,
      disabled: !this.canNext(acc),
      onClick,
      children: t('common:next'),
    }

    return <Button {...props} />
  }

  render() {
    const { t } = this.props
    const { stepIndex, account } = this.state

    return (
      <Modal
        name={MODAL_RECEIVE}
        onHide={this.handleReset}
        render={({ data, onClose }) => {
          const acc = account || get(data, 'account', null)
          return (
            <ModalBody onClose={onClose} deferHeight={344}>
              <ModalTitle>{t('receive:title')}</ModalTitle>
              <ModalContent>
                <Breadcrumb mb={6} currentStep={stepIndex} items={this._steps} />
                {this.renderStep(acc)}
              </ModalContent>
              <ModalFooter>
                <Box horizontal alignItems="center" justifyContent="flex-end">
                  {this.renderButton(acc)}
                </Box>
              </ModalFooter>
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default translate()(ReceiveModal)
