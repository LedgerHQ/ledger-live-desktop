// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { ipcRenderer } from 'electron'
import differenceBy from 'lodash/differenceBy'
import { listCurrencies, getDefaultUnitByCoinType } from '@ledgerhq/currencies'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { Currency } from '@ledgerhq/currencies'

import { MODAL_ADD_ACCOUNT } from 'config/constants'

import type { Device, T } from 'types/common'

import { closeModal } from 'reducers/modals'
import { canCreateAccount, getAccounts, getArchivedAccounts } from 'reducers/accounts'
import { getCurrentDevice } from 'reducers/devices'
import { sendEvent } from 'renderer/events'

import { addAccount, updateAccount } from 'actions/accounts'
import { fetchCounterValues } from 'actions/counterValues'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import DeviceConnect from 'components/DeviceConnect'
import DeviceMonit from 'components/DeviceMonitNew'
import FormattedVal from 'components/base/FormattedVal'
import Label from 'components/base/Label'
import Modal, { ModalBody } from 'components/base/Modal'
import Select from 'components/base/Select'
import Text from 'components/base/Text'

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
          <Label>{props.t('common:currency')}</Label>
          <Select
            placeholder={props.t('common:chooseWalletPlaceholder')}
            onChange={item => props.onChangeCurrency(item.data)}
            renderSelected={item => item.name}
            items={currencies}
            value={props.currency ? currencies.find(c => c.key === props.currency.coinType) : null}
          />
        </Box>
        <Box horizontal justifyContent="flex-end">
          {props.fetchingCounterValues ? (
            'Fetching counterValues...'
          ) : (
            <Button primary type="submit">
              {props.t('addAccount:title')}
            </Button>
          )}
        </Box>
      </Box>
    </form>
  ),
  connectDevice: (props: Object) => (
    <DeviceMonit
      coinType={props.currency.coinType}
      render={({ status, devices, currentDevice }) => (
        <DeviceConnect
          coinType={props.currency.coinType}
          appOpened={
            status === 'appConnected.success'
              ? 'success'
              : status === 'appConnected.fail' ? 'fail' : null
          }
          devices={devices}
          deviceSelected={currentDevice}
          onChangeDevice={d => console.log('onChangeDevice', d)}
        />
      )}
    />
  ),
  inProgress: ({ progress, unit }: Object) => (
    <Box>
      In progress.
      {progress !== null && (
        <Box>
          <Box>Account: {progress.account}</Box>
          <Box>
            Balance:{' '}
            <FormattedVal
              alwaysShowSign={false}
              color="dark"
              unit={unit}
              showCode
              val={progress.balance || 0}
            />
          </Box>
          <Box>Operations: {progress.operations || 0}</Box>
          {progress.success && <Box>Finish ! Next account in progress...</Box>}
        </Box>
      )}
    </Box>
  ),
  listAccounts: (props: Object) => {
    const { accounts, archivedAccounts } = props
    const emptyAccounts = accounts.filter(account => account.operations.length === 0)
    const existingAccounts = accounts.filter(account => account.operations.length > 0)
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
  accounts: Account[],
  addAccount: Function,
  archivedAccounts: Account[],
  canCreateAccount: boolean,
  closeModal: Function,
  counterValues: Object,
  currentDevice: Device | null,
  fetchCounterValues: Function,
  t: T,
  updateAccount: Function,
}

type State = {
  accounts: Account[],
  currency: Currency | null,
  fetchingCounterValues: boolean,
  progress: null | Object,
  step: Step,
}

const mapStateToProps = state => ({
  accounts: getAccounts(state),
  archivedAccounts: getArchivedAccounts(state),
  canCreateAccount: canCreateAccount(state),
  counterValues: state.counterValues,
  currentDevice: getCurrentDevice(state),
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
  fetchCounterValues,
  updateAccount,
}

const defaultState = {
  step: 'chooseCurrency',
  progress: null,
  fetchingCounterValues: false,
  currency: null,
  accounts: [],
}

class AddAccountModal extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
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

    // if (step === 'connectDevice' && currentDevice !== null) {
    //   this.getWalletInfos()
    // } else {
    //   clearTimeout(this._timeout)
    // }
  }

  componentWillUnmount() {
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
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
    const { currency, step, progress, accounts, fetchingCounterValues } = this.state

    const props = (predicate, props) => (predicate ? props : {})

    return {
      ...props(step === 'chooseCurrency', {
        currency,
        fetchingCounterValues,
        onChangeCurrency: this.handleChangeCurrency,
        onSubmit: this.handleSubmit,
        t,
      }),
      ...props(step === 'connectDevice', {
        t,
        currency,
      }),
      ...props(step === 'inProgress', {
        t,
        progress,
        unit: currency !== null && getDefaultUnitByCoinType(currency.coinType),
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

  handleMsgEvent = (e, { data, type }) => {
    if (type === 'wallet.getAccounts.start') {
      this._pid = data.pid
    }

    if (type === 'wallet.getAccounts.progress') {
      this.setState(prev => ({
        step: 'inProgress',
        progress:
          prev.progress === null
            ? data
            : prev.progress.success
              ? data
              : {
                  ...prev.progress,
                  ...data,
                },
      }))
    }

    if (type === 'wallet.getAccounts.fail') {
      this._timeout = setTimeout(() => this.getWalletInfos(), 1e3)
    }

    if (type === 'wallet.getAccounts.success') {
      // As data is passed inside electron event system,
      // dates are converted to their string equivalent
      //
      // so, quick & dirty way to put back Date objects
      const parsedData = data.map(account => ({
        ...account,
        operations: account.operations.map(op => ({
          ...op,
          date: new Date(op.date),
        })),
      }))

      this.setState({
        accounts: parsedData,
        step: 'listAccounts',
      })
    }
  }

  handleAddAccount = account => this.addAccount(account)

  handleImportAccounts = accounts => accounts.forEach(account => this.addAccount(account))

  handleChangeCurrency = (currency: Currency) => this.setState({ currency })

  handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { fetchCounterValues } = this.props
    const { currency } = this.state

    if (currency !== null) {
      this.setState({
        fetchingCounterValues: true,
      })

      await fetchCounterValues(currency.coinType)

      this.setState({
        fetchingCounterValues: false,
        step: 'connectDevice',
      })
    }
  }

  handleClose = () => {
    sendEvent('msg', 'kill.process', {
      pid: this._pid,
    })
    clearTimeout(this._timeout)
  }

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
  _pid = null

  render() {
    const { step } = this.state
    const { t } = this.props

    return (
      <Modal
        name={MODAL_ADD_ACCOUNT}
        preventBackdropClick={step !== 'chooseCurrency'}
        onClose={this.handleClose}
        onHide={this.handleHide}
        render={({ onClose }) => {
          const Step = Steps[step]

          return (
            <ModalBody onClose={onClose} flow={3}>
              <Text fontSize={6} color="graphite">
                {t('addAccount:title')}
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
