// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { ipcRenderer } from 'electron'
import differenceBy from 'lodash/differenceBy'
import { listCurrencies, getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies'

import { MODAL_ADD_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { Accounts, Device, T } from 'types/common'

import { closeModal } from 'reducers/modals'
import { canCreateAccount, getAccounts, getArchivedAccounts } from 'reducers/accounts'
import { getCurrentDevice } from 'reducers/devices'
import { sendEvent } from 'renderer/events'

import { addAccount, updateAccount } from 'actions/accounts'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import Select from 'components/base/Select'

import CreateAccount from './CreateAccount'
import ImportAccounts from './ImportAccounts'
import RestoreAccounts from './RestoreAccounts'

const currencies = listCurrencies().map(currency => ({
  key: currency.coinType,
  name: currency.name,
  data: currency,
}))

const Steps = {
  chooseCurrency: (props: Object) => (
    <form onSubmit={props.onSubmit}>
      <Box flow={3}>
        <Box flow={1}>
          <Label>{props.t('common.currency')}</Label>
          <Select
            placeholder={props.t('common.chooseWalletPlaceholder')}
            onChange={item => props.onChangeCurrency(item.data)}
            renderSelected={item => item.name}
            items={currencies}
            value={props.currency ? currencies.find(c => c.key === props.currency.coinType) : null}
          />
        </Box>
        <Box horizontal justifyContent="flex-end">
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
      <Box>Start {props.currency.name} App on your Ledger: ko</Box>
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
    const { accounts, archivedAccounts } = props
    const emptyAccounts = accounts.filter(account => account.transactions.length === 0)
    const existingAccounts = accounts.filter(account => account.transactions.length > 0)
    const canCreateAccount = props.canCreateAccount && emptyAccounts.length === 1
    const newAccount = emptyAccounts[0]
    return (
      <Box flow={10}>
        <ImportAccounts {...props} accounts={existingAccounts} />
        {!!archivedAccounts.length && <RestoreAccounts {...props} accounts={archivedAccounts} />}
        {canCreateAccount ? (
          <CreateAccount {...props} account={newAccount} />
        ) : (
          <Box>{`You can't create new account`}</Box>
        )}
      </Box>
    )
  },
}

type Step = 'chooseCurrency' | 'connectDevice' | 'inProgress' | 'listAccounts'

type Props = {
  t: T,
  accounts: Accounts,
  archivedAccounts: Accounts,
  addAccount: Function,
  updateAccount: Function,
  canCreateAccount: boolean,
  closeModal: Function,
  currentDevice: Device | null,
}

type State = {
  step: Step,
  currency: Currency | null,
  accounts: Accounts,
  progress: null | Object,
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  accounts: getAccounts(state),
  archivedAccounts: getArchivedAccounts(state),
  canCreateAccount: canCreateAccount(state),
  currentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  addAccount,
  updateAccount,
  closeModal,
}

const defaultState = {
  currency: null,
  accounts: [],
  progress: null,
  step: 'chooseCurrency',
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
        accounts: differenceBy(prev.accounts, nextProps.accounts, 'id'),
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
    const { currency } = this.state

    if (currentDevice === null || currency === null) {
      return
    }

    sendEvent('usb', 'wallet.getAccounts', {
      pathDevice: currentDevice.path,
      coinType: currency.coinType,
      currentAccounts: accounts.map(acc => acc.id),
    })
  }

  getStepProps() {
    const { currentDevice, archivedAccounts, canCreateAccount, updateAccount, t } = this.props
    const { currency, step, progress, accounts } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'chooseCurrency', {
        t,
        currency,
        onChangeCurrency: this.handleChangeCurrency,
        onSubmit: this.handleSubmit,
      }),
      ...props(step === 'connectDevice', {
        t,
        connected: currentDevice !== null,
        currency,
      }),
      ...props(step === 'inProgress', {
        t,
        progress,
      }),
      ...props(step === 'listAccounts', {
        t,
        accounts,
        archivedAccounts,
        canCreateAccount,
        updateAccount,
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

  handleChangeCurrency = (currency: Currency) => this.setState({ currency })

  handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({
      step: 'connectDevice',
    })
  }

  handleClose = () => clearTimeout(this._timeout)

  handleHide = () =>
    this.setState({
      ...defaultState,
    })

  addAccount = account => {
    const { currency } = this.state
    const { addAccount } = this.props

    if (currency === null) {
      return
    }

    addAccount({
      ...account,
      coinType: currency.coinType,
      currency,
      unit: getDefaultUnitByCoinType(currency.coinType),
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
              <Text fontSize={6} color="steel">
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
