// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { ipcRenderer } from 'electron'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { Account } from '@ledgerhq/wallet-common/lib/types'
import type { Currency } from '@ledgerhq/currencies'

import type { Device, T } from 'types/common'

import { MODAL_ADD_ACCOUNT } from 'config/constants'

import { closeModal } from 'reducers/modals'
import { canCreateAccount, getAccounts, getArchivedAccounts } from 'reducers/accounts'
import { sendEvent } from 'renderer/events'

import { addAccount, updateAccount } from 'actions/accounts'
import { fetchCounterValues } from 'actions/counterValues'

import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'
import Button from 'components/base/Button'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalBody } from 'components/base/Modal'
import StepConnectDevice from 'components/modals/StepConnectDevice'

import StepCurrency from './01-step-currency'
import StepImport from './03-step-import'

const GET_STEPS = t => [
  { label: t('addAccount:steps.currency.title'), Comp: StepCurrency },
  { label: t('addAccount:steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('addAccount:steps.importProgress.title'), Comp: StepImport },
  { label: t('addAccount:steps.importAccounts.title'), Comp: StepImport },
]

const mapStateToProps = state => ({
  accounts: getAccounts(state),
  archivedAccounts: getArchivedAccounts(state),
  canCreateAccount: canCreateAccount(state),
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
  fetchCounterValues,
  updateAccount,
}

type Props = {
  accounts: Account[],
  addAccount: Function,
  archivedAccounts: Account[],
  canCreateAccount: boolean,
  closeModal: Function,
  fetchCounterValues: Function,
  t: T,
  updateAccount: Function,
}

type State = {
  accountsImport: Object,
  currency: Currency | null,
  deviceSelected: Device | null,
  fetchingCounterValues: boolean,
  selectedAccounts: Array<number>,
  appStatus: null | string,
  stepIndex: number,
}

const INITIAL_STATE = {
  accountsImport: {},
  currency: null,
  deviceSelected: null,
  fetchingCounterValues: false,
  selectedAccounts: [],
  appStatus: null,
  stepIndex: 0,
}

class AddAccountModal extends PureComponent<Props, State> {
  state = INITIAL_STATE

  componentDidMount() {
    ipcRenderer.on('msg', this.handleMsgEvent)
  }

  async componentWillUpdate(nextProps, nextState) {
    const { fetchingCounterValues, stepIndex } = this.state
    const { stepIndex: nextStepIndex } = nextState

    if (!fetchingCounterValues && stepIndex === 0 && nextStepIndex === 1) {
      await this.fetchCounterValues()
    }
  }

  componentWillUnmount() {
    this.killProcess()
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
    clearTimeout(this._timeout)
  }

  importsAccounts() {
    const { accounts } = this.props
    const { deviceSelected, currency } = this.state

    if (deviceSelected === null || currency === null) {
      return
    }

    sendEvent('usb', 'wallet.getAccounts', {
      pathDevice: deviceSelected.path,
      coinType: currency.coinType,
      currentAccounts: accounts.map(acc => acc.id),
    })
  }

  async fetchCounterValues() {
    const { fetchCounterValues } = this.props
    const { currency } = this.state

    if (!currency) {
      return
    }

    this.setState({
      fetchingCounterValues: true,
      stepIndex: 0,
    })

    await fetchCounterValues([currency])

    this.setState({
      fetchingCounterValues: false,
      stepIndex: 1,
    })
  }

  canNext = () => {
    const { stepIndex } = this.state

    if (stepIndex === 0) {
      const { currency } = this.state
      return currency !== null
    }

    if (stepIndex === 1) {
      const { deviceSelected, appStatus } = this.state
      return deviceSelected !== null && appStatus === 'success'
    }

    if (stepIndex === 3) {
      const { selectedAccounts } = this.state
      return selectedAccounts.length > 0
    }

    return false
  }

  _steps = GET_STEPS(this.props.t)

  handleMsgEvent = (e, { data, type }) => {
    const { accountsImport, currency } = this.state
    const { addAccount } = this.props

    if (type === 'wallet.getAccounts.start') {
      this._pid = data.pid
    }

    if (type === 'wallet.getAccounts.progress') {
      this.setState(prev => ({
        stepIndex: 2,
        accountsImport: {
          ...(data !== null
            ? {
                [data.id]: {
                  ...data,
                  name: `Account ${data.accountIndex + 1}`,
                },
              }
            : {}),
          ...prev.accountsImport,
        },
      }))

      if (currency && data && data.finish) {
        const { accountIndex, finish, ...account } = data
        addAccount({
          ...account,
          // As data is passed inside electron event system,
          // dates are converted to their string equivalent
          //
          // so, quick & dirty way to put back Date objects
          operations: account.operations.map(op => ({
            ...op,
            date: new Date(op.date),
          })),
          name: `Account ${accountIndex + 1}`,
          archived: true,
          currency,
          unit: getDefaultUnitByCoinType(currency.coinType),
        })
      }
    }

    if (type === 'wallet.getAccounts.success') {
      this.setState({
        selectedAccounts: Object.keys(accountsImport).map(k => accountsImport[k].id),
        stepIndex: 3,
      })
    }
  }

  handleChangeDevice = d => this.setState({ deviceSelected: d })

  handleSelectAccount = a => () =>
    this.setState(prev => ({
      selectedAccounts: prev.selectedAccounts.includes(a)
        ? prev.selectedAccounts.filter(x => x !== a)
        : [a, ...prev.selectedAccounts],
    }))

  handleChangeCurrency = (currency: Currency) => this.setState({ currency })

  handleChangeStatus = (deviceStatus, appStatus) => this.setState({ appStatus })

  handleImportAccount = () => {
    const { archivedAccounts, updateAccount, closeModal } = this.props
    const { selectedAccounts } = this.state
    const accounts = archivedAccounts.filter(a => selectedAccounts.includes(a.id))
    accounts.forEach(a => updateAccount({ ...a, archived: false }))
    this.setState({ selectedAccounts: [] })
    closeModal(MODAL_ADD_ACCOUNT)
  }

  handleNextStep = () => {
    const { stepIndex } = this.state
    if (stepIndex >= this._steps.length - 1) {
      return
    }
    this.setState({ stepIndex: stepIndex + 1 })
  }

  handleReset = () => {
    this.killProcess()
    clearTimeout(this._timeout)
    this.setState(INITIAL_STATE)
  }

  killProcess = () =>
    sendEvent('msg', 'kill.process', {
      pid: this._pid,
    })

  _timeout = undefined
  _pid = null

  renderStep() {
    const { accounts, archivedAccounts, t } = this.props
    const { stepIndex, currency, accountsImport, deviceSelected, selectedAccounts } = this.state
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step

    const props = (predicate, props) => (predicate ? props : {})

    const stepProps = {
      t,
      currency,
      ...props(stepIndex === 0, {
        onChangeCurrency: this.handleChangeCurrency,
      }),
      ...props(stepIndex === 1, {
        deviceSelected,
        onStatusChange: this.handleChangeStatus,
        onChangeDevice: this.handleChangeDevice,
      }),
      ...props(stepIndex === 2, {
        accountsImport,
        importProgress: true,
      }),
      ...props(stepIndex === 3, {
        accountsImport: Object.keys(accountsImport).reduce((result, k) => {
          const account = accountsImport[k]
          const existingAccount = accounts.find(a => a.id === account.id)
          if (!existingAccount || (existingAccount && existingAccount.archived)) {
            result[account.id] = account
          }
          return result
        }, {}),
        archivedAccounts: archivedAccounts.filter(a => !accountsImport[a.id]),
        importProgress: false,
        onSelectAccount: this.handleSelectAccount,
        selectedAccounts,
      }),
    }

    return <Comp {...stepProps} />
  }

  renderButton() {
    const { t } = this.props
    const { fetchingCounterValues, stepIndex, selectedAccounts } = this.state

    let onClick

    switch (stepIndex) {
      case 1:
        onClick = () => {
          this.handleNextStep()
          this.importsAccounts()
        }
        break

      case 3:
        onClick = this.handleImportAccount
        break

      default:
        onClick = this.handleNextStep
    }

    const props = {
      primary: true,
      disabled: fetchingCounterValues || !this.canNext(),
      onClick,
      children: fetchingCounterValues
        ? 'Fetching counterValues...'
        : stepIndex === 3
          ? t('addAccount:steps.importAccounts.cta', {
              count: selectedAccounts.length,
            })
          : t('common:next'),
    }

    return <Button {...props} />
  }

  render() {
    const { t } = this.props
    const { stepIndex } = this.state

    return (
      <Modal
        name={MODAL_ADD_ACCOUNT}
        onHide={this.handleReset}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('addAccount:title')}</ModalTitle>
            <ModalContent>
              <Breadcrumb mb={6} currentStep={stepIndex} items={this._steps} />
              {this.renderStep()}
            </ModalContent>
            {stepIndex !== 2 && (
              <ModalFooter>
                <Box horizontal alignItems="center" justifyContent="flex-end">
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

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AddAccountModal)
