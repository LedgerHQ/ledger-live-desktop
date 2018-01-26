// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ipcRenderer } from 'electron'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, Device } from 'types/common'

import { closeModal } from 'reducers/modals'
import { canCreateAccount, getAccounts } from 'reducers/accounts'
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

import ImportAccounts from './ImportAccounts'

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
            Add account
          </Button>
        </Box>
      </Box>
    </form>
  ),
  connectDevice: (props: Object) => (
    <div>
      <div>Connect your Ledger: {props.connected ? 'ok' : 'ko'}</div>
      <div>Start {props.wallet.toUpperCase()} App on your Ledger: ko</div>
    </div>
  ),
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
    const accounts = Object.entries(props.accounts).map(([, account]: [string, any]) => account)
    const existingAccounts = accounts.filter(account => account.transactions.length > 0)
    // const newAccount = accounts.find(account => account.transactions.length === 0)
    return (
      <Box>
        <ImportAccounts {...props} accounts={existingAccounts} />
      </Box>
    )
  },
  // listAccounts: (props: Object) => {
  //   const accounts = []
  //
  //   let newAccount = null
  //
  //   Object.entries(props.accounts).forEach(([, account]: [string, any]) => {
  //     const hasTransactions = account.transactions.length > 0
  //
  //     if (hasTransactions) {
  //       accounts.push(account)
  //     } else {
  //       newAccount = account
  //     }
  //   })
  //
  //   return (
  //     <div>
  //       {accounts.map(account => (
  //         <div key={account.id} style={{ marginBottom: 10 }}>
  //           <div>Balance: {formatBTC(account.balance)}</div>
  //           <div>Transactions: {account.transactions.length}</div>
  //           <div>
  //             <Button onClick={props.onAddAccount(account)}>Import</Button>
  //           </div>
  //         </div>
  //       ))}
  //       {props.canCreateAccount && newAccount !== null ? (
  //         <div>
  //           <Button onClick={props.onAddAccount(newAccount)}>Create new account</Button>
  //         </div>
  //       ) : (
  //         <div>You cannot create new account</div>
  //       )}
  //     </div>
  //   )
  // },
}

type InputValue = {
  accountName: string,
  wallet: string,
}

type Step = 'createAccount' | 'connectDevice' | 'inProgress' | 'listAccounts'

type Props = {
  accounts: Accounts,
  addAccount: Function,
  canCreateAccount: boolean,
  closeModal: Function,
  currentDevice: Device | null,
}
type State = {
  inputValue: InputValue,
  step: Step,
  accounts: Object,
  progress: null | Object,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getAccounts(state),
  canCreateAccount: canCreateAccount(state),
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

  componentDidUpdate() {
    const { step } = this.state
    const { currentDevice } = this.props

    if (step === 'connectDevice' && currentDevice !== null) {
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
    const { currentDevice, accounts } = this.props
    const { inputValue } = this.state

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
    const { currentDevice, canCreateAccount } = this.props
    const { inputValue, step, progress, accounts } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'createAccount', {
        value: inputValue,
        onSubmit: this.handleSubmit,
        onChangeInput: this.handleChangeInput,
      }),
      ...props(step === 'connectDevice', {
        connected: currentDevice !== null,
        wallet: inputValue.wallet,
      }),
      ...props(step === 'inProgress', {
        progress,
      }),
      ...props(step === 'listAccounts', {
        accounts,
        canCreateAccount,
        onAddAccount: this.handleAddAccount,
        onImportAccounts: this.handleImportAccounts,
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

  handleAddAccount = account => () => {
    const { inputValue } = this.state
    const { addAccount } = this.props

    const { id, ...data } = account

    addAccount({
      id,
      name: inputValue.accountName,
      type: inputValue.wallet,
      data,
    })
  }

  handleImportAccounts = accountsSelected => () => {
    const { inputValue, accounts } = this.state
    const { addAccount } = this.props

    Object.entries(accounts).forEach(([, account]: [string, any], i) => {
      if (accountsSelected.includes(account.id)) {
        addAccount({
          id: account.id,
          name: `Account ${i + 1}`,
          type: inputValue.wallet,
          data: account,
        })
      }
    })
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

    const { inputValue } = this.state

    if (inputValue.accountName.trim() === '' || inputValue.wallet.trim() === '') {
      return
    }

    this.setState({
      step: 'connectDevice',
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
        preventBackdropClick={step !== 'createAccount'}
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
