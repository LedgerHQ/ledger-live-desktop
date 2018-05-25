// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import type { Account, CryptoCurrency } from '@ledgerhq/live-common/lib/types'

import type { Device, T } from 'types/common'

import { MODAL_ADD_ACCOUNT } from 'config/constants'

import { closeModal } from 'reducers/modals'
import {
  canCreateAccount,
  getAccounts,
  getVisibleAccounts,
  getArchivedAccounts,
} from 'reducers/accounts'

import { addAccount, updateAccount } from 'actions/accounts'

import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'
import Button from 'components/base/Button'
import Modal, { ModalContent, ModalTitle, ModalFooter, ModalBody } from 'components/base/Modal'
import StepConnectDevice from 'components/modals/StepConnectDevice'
import { getBridgeForCurrency } from 'bridge'

import StepCurrency from './01-step-currency'
import StepImport from './03-step-import'

const GET_STEPS = t => [
  { label: t('addAccount:steps.currency.title'), Comp: StepCurrency },
  { label: t('addAccount:steps.connectDevice.title'), Comp: StepConnectDevice },
  { label: t('addAccount:steps.importProgress.title'), Comp: StepImport },
  { label: t('addAccount:steps.importAccounts.title'), Comp: StepImport },
]

const mapStateToProps = createStructuredSelector({
  existingAccounts: getAccounts,
  visibleAccounts: getVisibleAccounts,
  archivedAccounts: getArchivedAccounts,
  canCreateAccount,
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
  updateAccount,
}

type Props = {
  existingAccounts: Account[],
  addAccount: Function,
  visibleAccounts: Account[],
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

  componentWillUnmount() {
    this.handleReset()
  }

  scanSubscription: *

  startScanAccountsDevice() {
    const { visibleAccounts } = this.props
    const { deviceSelected, currency } = this.state

    if (!deviceSelected || !currency) {
      return
    }
    const bridge = getBridgeForCurrency(currency)
    this.scanSubscription = bridge.scanAccountsOnDevice(currency, deviceSelected.path, {
      next: account => {
        if (!visibleAccounts.some(a => a.id === account.id)) {
          this.setState(state => ({
            scannedAccounts: [...state.scannedAccounts, account],
          }))
        }
      },
      complete: () => {
        // we should be able to interrupt the scan too if you want to select early etc..
        // like imagine there are way too more accounts to scan, so you are not stuck here.
        this.setState({ stepIndex: 3 })
      },
      error: error => {
        // TODO what to do ?
        console.error(error)
      },
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
    const { addAccount } = this.props
    const { selectedAccounts } = this.state
    selectedAccounts.forEach(a => addAccount({ ...a, archived: false }))
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
    if (this.scanSubscription) this.scanSubscription.unsubscribe()
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
        preventBackdropClick
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
