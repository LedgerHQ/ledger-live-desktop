// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { ipcRenderer } from 'electron'

import { MODAL_ADD_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, Device, T } from 'types/common'

import { closeModal } from 'reducers/modals'
import { canCreateAccount, getAccounts } from 'reducers/accounts'
import { getCurrentDevice } from 'reducers/devices'
import { sendEvent } from 'renderer/events'

import { addAccount } from 'actions/accounts'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import Select from 'components/base/Select'

import CreateAccount from './CreateAccount'
import ImportAccounts from './ImportAccounts'

const currencies = [
  {
    key: 'btc',
    name: 'Bitcoin',
  },
]

const Steps = {
  chooseWallet: (props: Object) => (
    <form onSubmit={props.onSubmit}>
      <Box flow={3}>
        <Box flow={1}>
          <Label>{props.t('common.currency')}</Label>
          <Select
            placeholder={props.t('common.chooseWalletPlaceholder')}
            onChange={item => props.onChangeInput('wallet')(item.key)}
            renderSelected={item => item.name}
            items={currencies}
            value={currencies.find(c => c.key === props.value.wallet)}
          />
        </Box>
        <Box horizontal justify="flex-end">
          <Button primary type="submit">
            {props.t('addAccount.title')}
          </Button>
        </Box>
      </Box>
    </form>
  ),
  connectDevice: (props: Object) => (
    <Box>
      <Box>Connect your Ledger: {props.connected ? 'ok' : 'ko'}</Box>
      <Box>Start {props.wallet.toUpperCase()} App on your Ledger: ko</Box>
    </Box>
  ),
  inProgress: (props: Object) => (
    <Box>
      In progress.
      {props.progress !== null && (
        <Box>
          Account: {props.progress.account} / Transactions: {props.progress.transactions}
        </Box>
      )}
    </Box>
  ),
  listAccounts: (props: Object) => {
    const accounts = Object.entries(props.accounts).map(([, account]: [string, any]) => account)
    const emptyAccounts = accounts.filter(account => account.transactions.length === 0)
    const existingAccounts = accounts.filter(account => account.transactions.length > 0)
    const canCreateAccount = props.canCreateAccount && emptyAccounts.length === 1
    const newAccount = emptyAccounts[0]
    return (
      <Box flow={10}>
        <ImportAccounts {...props} accounts={existingAccounts} />
        {canCreateAccount ? (
          <CreateAccount {...props} account={newAccount} />
        ) : (
          <Box>{`You can't create new account`}</Box>
        )}
      </Box>
    )
  },
}

type InputValue = {
  wallet: string,
}

type Step = 'chooseWallet' | 'connectDevice' | 'inProgress' | 'listAccounts'

type Props = {
  t: T,
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
    wallet: '',
  },
  accounts: {},
  progress: null,
  step: 'chooseWallet',
}

class AddAccountModal extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleWalletRequest)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accounts) {
      this.setState(prev => ({
        accounts: Object.keys(prev.accounts).reduce((result, value) => {
          if (!nextProps.accounts[value]) {
            result[value] = prev.accounts[value]
          }
          return result
        }, {}),
      }))
    }
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
    const { currentDevice, canCreateAccount, t } = this.props
    const { inputValue, step, progress, accounts } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'chooseWallet', {
        t,
        value: inputValue,
        onSubmit: this.handleSubmit,
        onChangeInput: this.handleChangeInput,
      }),
      ...props(step === 'connectDevice', {
        t,
        connected: currentDevice !== null,
        wallet: inputValue.wallet,
      }),
      ...props(step === 'inProgress', {
        t,
        progress,
      }),
      ...props(step === 'listAccounts', {
        t,
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

  handleAddAccount = account => this.addAccount(account)

  handleImportAccounts = accounts => accounts.forEach(account => this.addAccount(account))

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

    if (inputValue.wallet.trim() === '') {
      return
    }

    this.setState({
      step: 'connectDevice',
    })
  }

  handleClose = () => clearTimeout(this._timeout)

  handleHide = () =>
    this.setState({
      ...defaultState,
    })

  addAccount = ({ id, name, ...data }) => {
    const { inputValue } = this.state
    const { addAccount } = this.props

    addAccount({
      id,
      name,
      type: inputValue.wallet,
      data,
    })
  }

  _timeout = undefined

  render() {
    const { step } = this.state
    const { t } = this.props

    return (
      <Modal
        name={MODAL_ADD_ACCOUNT}
        preventBackdropClick={step !== 'chooseWallet'}
        onHide={this.handleHide}
        render={({ onClose }) => {
          const Step = Steps[step]

          return (
            <ModalBody onClose={onClose} flow={3}>
              <Text fontSize={4} color="steel">
                {t('addAccount.title')}
              </Text>
              <Step {...this.getStepProps()} />
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AddAccountModal)
