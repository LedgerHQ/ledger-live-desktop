// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { ipcRenderer } from 'electron'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import type { Device, T } from 'types/common'

import { MODAL_ADD_ACCOUNT } from 'config/constants'

import { closeModal } from 'reducers/modals'
import {
  canCreateAccount,
  getAccounts,
  getArchivedAccounts,
  decodeAccount,
} from 'reducers/accounts'

import runJob from 'renderer/runJob'

import { addAccount, updateAccount } from 'actions/accounts'

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
  existingAccounts: getAccounts(state),
  archivedAccounts: getArchivedAccounts(state),
  canCreateAccount: canCreateAccount(state),
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
  updateAccount,
}

type Props = {
  existingAccounts: Account[],
  addAccount: Function,
  archivedAccounts: Account[],
  canCreateAccount: boolean,
  closeModal: Function,
  t: T,
  updateAccount: Function,
}

type State = {
  stepIndex: number,

  currency: ?CryptoCurrency,
  deviceSelected: ?Device,

  selectedAccounts: Account[],
  scannedAccounts: Account[],

  // TODO: what's that.
  fetchingCounterValues: boolean,
  appStatus: ?string,
}

const INITIAL_STATE = {
  stepIndex: 0,
  currency: null,
  deviceSelected: null,

  selectedAccounts: [],
  scannedAccounts: [],

  fetchingCounterValues: false,
  appStatus: null,
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
      // TODO: seems shady to do this here..............
      await this.fetchCounterValues()
    }
  }

  componentWillUnmount() {
    this.handleReset()
    ipcRenderer.removeListener('msg', this.handleMsgEvent)
  }

  async startScanAccountsDevice() {
    const { deviceSelected, currency } = this.state

    if (!deviceSelected || !currency) {
      return
    }

    try {
      // scan every account for given currency and device
      await runJob({
        channel: 'accounts',
        job: 'scan',
        successResponse: 'accounts.scanAccountsOnDevice.success',
        errorResponse: 'accounts.scanAccountsOnDevice.fail',
        data: {
          devicePath: deviceSelected.path,
          currencyId: currency.id,
        },
      })

      // go to final step
      this.setState({ stepIndex: 3 })
    } catch (err) {
      console.log(err)
    }
  }

  async fetchCounterValues() {
    const { currency } = this.state

    if (!currency) {
      return
    }

    this.setState({
      fetchingCounterValues: true,
      stepIndex: 0,
    })

    // FIXME I don't really understand this step.
    // also countervalues should not block the app to work.
    // imagine our api is down...
    // await fetchCounterValues([currency])

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
    const { addAccount, existingAccounts } = this.props

    if (type === 'accounts.scanAccountsOnDevice.accountScanned') {
      // create Account from AccountRaw account scanned on device
      const account = {
        ...decodeAccount(data),
        archived: true,
      }

      // add it to the reducer if needed, archived
      if (!existingAccounts.find(a => a.id === account.id)) {
        addAccount(account)
        this.setState(state => ({
          scannedAccounts: [...state.scannedAccounts, account],
        }))
      }
    }
  }

  handleChangeDevice = d => this.setState({ deviceSelected: d })

  handleToggleAccount = account => {
    const { selectedAccounts } = this.state
    const isSelected = selectedAccounts.find(a => a === account)
    this.setState({
      selectedAccounts: isSelected
        ? selectedAccounts.filter(a => a !== account)
        : [...selectedAccounts, account],
    })
  }

  handleChangeCurrency = (currency: CryptoCurrency) => this.setState({ currency })

  handleChangeStatus = (deviceStatus, appStatus) => this.setState({ appStatus })

  handleImportAccount = () => {
    const { updateAccount } = this.props
    const { selectedAccounts } = this.state
    selectedAccounts.forEach(a => updateAccount({ ...a, archived: false }))
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
    this.setState(INITIAL_STATE)
  }

  renderStep() {
    const { t, existingAccounts } = this.props
    const { stepIndex, scannedAccounts, currency, deviceSelected, selectedAccounts } = this.state
    const step = this._steps[stepIndex]
    if (!step) {
      return null
    }
    const { Comp } = step

    const props = (predicate, props) => (predicate ? props : {})

    const stepProps = {
      t,
      currency,
      // STEP CURRENCY
      ...props(stepIndex === 0, {
        onChangeCurrency: this.handleChangeCurrency,
      }),
      // STEP CONNECT DEVICE
      ...props(stepIndex === 1, {
        deviceSelected,
        onStatusChange: this.handleChangeStatus,
        onChangeDevice: this.handleChangeDevice,
      }),
      // STEP ACCOUNT IMPORT PROGRESS
      ...props(stepIndex === 2, {
        selectedAccounts,
        scannedAccounts,
        existingAccounts,
      }),
      // STEP FINISH AND SELECT ACCOUNTS
      ...props(stepIndex === 3, {
        onToggleAccount: this.handleToggleAccount,
        selectedAccounts,
        scannedAccounts,
        existingAccounts,
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
          this.startScanAccountsDevice()
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
