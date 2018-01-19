// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import type { MapStateToProps } from 'react-redux'
import type { Device } from 'types/common'

import { sendSyncEvent } from 'renderer/events'
import { getCurrentDevice } from 'reducers/devices'
import { closeModal } from 'reducers/modals'

import { addAccount } from 'actions/accounts'

import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Modal, { ModalBody } from 'components/base/Modal'
import Select from 'components/base/Select'

const Label = styled.label`
  display: block;
  text-transform: uppercase;
`

const Steps = {
  createAccount: (props: Object) => (
    <form onSubmit={props.onSubmit}>
      <div>
        <Label>Currency</Label>
        <Select
          placeholder="Choose a wallet..."
          onChange={item => props.onChangeInput('wallet')(item.key)}
          renderSelected={item => item.name}
          items={[
            {
              key: 'btc',
              name: 'Bitcoin',
            },
          ]}
        />
      </div>
      <div>
        <Label>Account name</Label>
        <Input onChange={props.onChangeInput('accountName')} value={props.value.accountName} />
      </div>
      <Button type="submit">Create account</Button>
    </form>
  ),
  connectDevice: () => <div>Connect your Ledger</div>,
  startWallet: (props: Object) => <div>Select {props.wallet.toUpperCase()} App on your Ledger</div>,
  confirmation: (props: Object) => (
    <div>
      Add {props.wallet.toUpperCase()} - {props.accountName} - {props.walletAddress} ?
      <Button onClick={props.onConfirm}>Yes!</Button>
    </div>
  ),
}

type InputValue = {
  accountName: string,
  wallet: string,
}

type Step = 'createAccount' | 'connectDevice' | 'startWallet' | 'confirmation'

type Props = {
  addAccount: Function,
  closeModal: Function,
  currentDevice: Device | null,
}
type State = {
  inputValue: InputValue,
  step: Step,
  walletAddress: string,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  currentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
}

const defaultState = {
  inputValue: {
    accountName: '',
    wallet: '',
  },
  walletAddress: '',
  step: 'createAccount',
}

class AddAccountModal extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillReceiveProps(nextProps) {
    const { currentDevice } = nextProps

    if (this.state.step !== 'createAccount') {
      this.setState({
        step: currentDevice !== null ? 'startWallet' : 'connectDevice',
      })
    }
  }

  componentDidUpdate() {
    const { step } = this.state
    const { currentDevice } = this.props

    if (step === 'startWallet' && currentDevice !== null) {
      this.getWalletInfos()
    } else {
      clearTimeout(this._timeout)
    }
  }

  getWalletInfos() {
    const { inputValue } = this.state
    const { currentDevice } = this.props

    if (currentDevice === null) {
      return
    }

    const { data: { data }, type } = sendSyncEvent('usb', 'wallet.infos.request', {
      path: currentDevice.path,
      wallet: inputValue.wallet,
    })

    if (type === 'wallet.infos.fail') {
      this._timeout = setTimeout(() => this.getWalletInfos(), 1e3)
    }

    if (type === 'wallet.infos.success') {
      this.setState({
        walletAddress: data.bitcoinAddress,
        step: 'confirmation',
      })
    }
  }

  getStepProps() {
    const { inputValue, walletAddress, step } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'createAccount', {
        value: inputValue,
        onSubmit: this.handleSubmit,
        onChangeInput: this.handleChangeInput,
      }),
      ...props(step === 'startWallet', {
        wallet: inputValue.wallet,
      }),
      ...props(step === 'confirmation', {
        accountName: inputValue.accountName,
        onConfirm: this.handleAddAccount,
        wallet: inputValue.wallet,
        walletAddress,
      }),
    }
  }

  handleAddAccount = () => {
    const { inputValue, walletAddress } = this.state
    const { addAccount, closeModal } = this.props

    const account = {
      name: inputValue.accountName,
      type: inputValue.wallet,
      address: walletAddress,
    }

    addAccount(account)
    closeModal('add-account')
  }

  handleChangeInput = (key: $Keys<InputValue>) => (value: $Values<InputValue>) =>
    this.setState(prev => ({
      inputValue: {
        ...prev.inputValue,
        [key]: value,
      },
    }))

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { currentDevice } = this.props
    const { inputValue } = this.state

    if (inputValue.accountName.trim() === '' || inputValue.wallet.trim() === '') {
      return
    }

    this.setState({
      step: currentDevice === null ? 'connectDevice' : 'startWallet',
    })
  }

  handleClose = () => {
    clearTimeout(this._timeout)
    this.setState({
      ...defaultState,
    })
  }

  _timeout = undefined

  render() {
    const { step } = this.state

    const Step = Steps[step]

    return (
      <Modal
        name="add-account"
        preventBackdropClick
        onClose={this.handleClose}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <Step {...this.getStepProps()} />
          </ModalBody>
        )}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAccountModal)
