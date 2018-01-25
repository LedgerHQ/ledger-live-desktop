// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, Device } from 'types/common'

import { closeModal } from 'reducers/modals'
import { getAccounts } from 'reducers/accounts'
import { getCurrentDevice } from 'reducers/devices'
import { sendEvent } from 'renderer/events'

import { addAccount } from 'actions/accounts'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import Select from 'components/base/Select'

const Steps = {
  createAccount: (props: Object) => (
    <form onSubmit={props.onSubmit}>
      <Box flow={3}>
        <Box flow={1}>
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
        </Box>
        <Box flow={1}>
          <Label>Account name</Label>
          <Input onChange={props.onChangeInput('accountName')} value={props.value.accountName} />
        </Box>
        <Box horizontal justify="flex-end">
          <Button primary type="submit">
            Create account
          </Button>
        </Box>
      </Box>
    </form>
  ),
  connectDevice: () => <div>Connect your Ledger</div>,
  startWallet: (props: Object) => <div>Select {props.wallet.toUpperCase()} App on your Ledger</div>,
  inProgress: (props: Object) => (
    <div>
      In progress.
      {props.progress !== null && (
        <div>
          Account: {props.progress.account} / Transactions: {props.progress.transactions}
        </div>
      )}
    </div>
  ),
  listAccounts: (props: Object) => {
    const accounts = Object.entries(props.accounts)
    return (
      <div>
        {accounts.length > 0
          ? accounts.map(([index, account]: [string, any]) => (
              <div key={index}>
                <div>Balance: {account.balance}</div>
                <div>Transactions: {account.transactions.length}</div>
                <div>
                  <Button onClick={props.onAddAccount(index)}>Import</Button>
                </div>
              </div>
            ))
          : 'No accounts'}
      </div>
    )
  },
}

type InputValue = {
  accountName: string,
  wallet: string,
}

type Step = 'createAccount' | 'connectDevice' | 'inProgress' | 'startWallet' | 'listAccounts'

type Props = {
  addAccount: Function,
  closeModal: Function,
  currentDevice: Device | null,
  accounts: Accounts,
}
type State = {
  inputValue: InputValue,
  step: Step,
  accounts: Object,
  progress: null | Object,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getAccounts(state),
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
  accounts: {},
  progress: null,
  step: 'createAccount',
}

class AddAccountModal extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleWalletRequest)
  }

  componentWillReceiveProps(nextProps) {
    const { currentDevice } = nextProps

    if (this.props.currentDevice === null && this.state.step !== 'createAccount') {
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

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleWalletRequest)
    clearTimeout(this._timeout)
  }

  getWalletInfos() {
    const { inputValue } = this.state
    const { currentDevice, accounts } = this.props

    if (currentDevice === null) {
      return
    }

    sendEvent('usb', 'wallet.getAccounts', {
      path: currentDevice.path,
      wallet: inputValue.wallet,
      currentAccounts: Object.keys(accounts),
    })
  }

  getStepProps() {
    const { inputValue, step, progress, accounts } = this.state

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
      ...props(step === 'inProgress', {
        progress,
      }),
      ...props(step === 'listAccounts', {
        accounts,
        onAddAccount: this.handleAddAccount,
      }),
    }
  }

  handleWalletRequest = (e, { data, type }) => {
    if (type === 'wallet.getAccounts.progress') {
      this.setState({
        step: 'inProgress',
        progress: data,
      })
    }

    if (type === 'wallet.getAccounts.fail') {
      this._timeout = setTimeout(() => this.getWalletInfos(), 1e3)
    }

    if (type === 'wallet.getAccounts.success') {
      this.setState({
        accounts: data,
        step: 'listAccounts',
      })
    }
  }

  handleAddAccount = index => () => {
    const { inputValue, accounts } = this.state
    const { addAccount, closeModal } = this.props

    const { id, ...data } = accounts[index]

    addAccount({
      id,
      name: inputValue.accountName,
      type: inputValue.wallet,
      data,
    })

    closeModal('add-account')
    this.handleClose()
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
          <ModalBody onClose={onClose} flow={3}>
            <Text fontSize={4} color="steel">
              {'Add account'}
            </Text>
            <Step {...this.getStepProps()} />
          </ModalBody>
        )}
      />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddAccountModal)
