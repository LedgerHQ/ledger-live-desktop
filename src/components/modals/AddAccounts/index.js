// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Trans, translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import Track from 'analytics/Track'
import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import { MODAL_ADD_ACCOUNTS } from 'config/constants'
import type { T, Device } from 'types/common'
import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'

import { idleCallback } from 'helpers/promise'
import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { addAccount } from 'actions/accounts'
import { closeModal } from 'reducers/modals'

import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import { validateNameEdition } from '@ledgerhq/live-common/lib/account'
import logger from 'logger'

import StepChooseCurrency, { StepChooseCurrencyFooter } from './steps/01-step-choose-currency'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepImport, { StepImportFooter } from './steps/03-step-import'
import StepFinish, { StepFinishFooter } from './steps/04-step-finish'

const createSteps = () => {
  const onBack = ({ transitionTo, resetScanState }: StepProps) => {
    resetScanState()
    transitionTo('chooseCurrency')
  }
  return [
    {
      id: 'chooseCurrency',
      label: <Trans i18nKey="addAccounts.breadcrumb.informations" />,
      component: StepChooseCurrency,
      footer: StepChooseCurrencyFooter,
      onBack: null,
      hideFooter: false,
      noScroll: true,
    },
    {
      id: 'connectDevice',
      label: <Trans i18nKey="addAccounts.breadcrumb.connectDevice" />,
      component: StepConnectDevice,
      footer: StepConnectDeviceFooter,
      onBack,
      hideFooter: false,
    },
    {
      id: 'import',
      label: <Trans i18nKey="addAccounts.breadcrumb.import" />,
      component: StepImport,
      footer: StepImportFooter,
      onBack,
      hideFooter: false,
    },
    {
      id: 'finish',
      label: <Trans i18nKey="addAccounts.breadcrumb.finish" />,
      component: StepFinish,
      footer: StepFinishFooter,
      onBack: null,
      hideFooter: true,
    },
  ]
}

type Props = {
  device: ?Device,
  existingAccounts: Account[],
  closeModal: string => void,
  addAccount: Account => void,
}

type StepId = 'chooseCurrency' | 'connectDevice' | 'import' | 'finish'
type ScanStatus = 'idle' | 'scanning' | 'error' | 'finished'

type State = {
  // TODO: I'm sure there will be always StepId and ScanStatus given,
  // but I struggle making flow understand it. So I put string as fallback
  stepId: StepId | string,
  scanStatus: ScanStatus | string,

  isAppOpened: boolean,
  currency: ?Currency,
  scannedAccounts: Account[],
  checkedAccountsIds: string[],
  editedNames: { [_: string]: string },
  err: ?Error,
  reset: number,
}

export type StepProps = DefaultStepProps & {
  t: T,
  currency: ?Currency,
  device: ?Device,
  isAppOpened: boolean,
  scannedAccounts: Account[],
  existingAccounts: Account[],
  checkedAccountsIds: string[],
  scanStatus: ScanStatus,
  err: ?Error,
  onClickAdd: () => Promise<void>,
  onGoStep1: () => void,
  onCloseModal: () => void,
  resetScanState: () => void,
  setCurrency: (?Currency) => void,
  setAppOpened: boolean => void,
  setScanStatus: (ScanStatus, ?Error) => string,
  setAccountName: (Account, string) => void,
  editedNames: { [_: string]: string },
  setScannedAccounts: ({ scannedAccounts?: Account[], checkedAccountsIds?: string[] }) => void,
}

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  existingAccounts: accountsSelector,
})

const mapDispatchToProps = {
  addAccount,
  closeModal,
}

const INITIAL_STATE = {
  stepId: 'chooseCurrency',
  isAppOpened: false,
  currency: null,
  scannedAccounts: [],
  checkedAccountsIds: [],
  editedNames: {},
  err: null,
  scanStatus: 'idle',
  reset: 0,
}

class AddAccounts extends PureComponent<Props, State> {
  state = INITIAL_STATE
  STEPS = createSteps()

  handleClickAdd = async () => {
    const { addAccount } = this.props
    const { scannedAccounts, checkedAccountsIds, editedNames } = this.state
    const accountsIdsMap = checkedAccountsIds.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
    const accountsToAdd = scannedAccounts.filter(account => accountsIdsMap[account.id] === true)
    for (const account of accountsToAdd) {
      await idleCallback()
      const name = validateNameEdition(account, editedNames[account.id])
      addAccount({ ...account, name })
    }
  }

  handleCloseModal = () => this.props.closeModal(MODAL_ADD_ACCOUNTS)
  handleStepChange = (step: Step) => this.setState({ stepId: step.id })

  handleSetCurrency = (currency: ?Currency) => this.setState({ currency })

  handleSetScanStatus = (scanStatus: string, err: ?Error = null) => {
    if (err) {
      logger.critical(err)
    }
    this.setState({ scanStatus, err })
  }

  handleSetAccountName = (account: Account, name: string) => {
    this.setState(({ editedNames }) => ({
      editedNames: { ...editedNames, [account.id]: name },
    }))
  }

  handleSetScannedAccounts = ({
    checkedAccountsIds,
    scannedAccounts,
  }: {
    checkedAccountsIds: string[],
    scannedAccounts: Account[],
  }) => {
    this.setState({
      ...(checkedAccountsIds ? { checkedAccountsIds } : {}),
      ...(scannedAccounts ? { scannedAccounts } : {}),
    })
  }

  handleResetScanState = () => {
    this.setState({
      isAppOpened: false,
      scanStatus: 'idle',
      err: null,
      scannedAccounts: [],
      checkedAccountsIds: [],
    })
  }

  handleSetAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened })

  onGoStep1 = () => {
    this.setState(({ reset }) => ({ ...INITIAL_STATE, reset: reset + 1 }))
  }

  render() {
    const { device, existingAccounts } = this.props
    const {
      stepId,
      currency,
      isAppOpened,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
      editedNames,
      reset,
    } = this.state

    const stepperProps = {
      currency,
      device,
      existingAccounts,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
      isAppOpened,
      onClickAdd: this.handleClickAdd,
      onCloseModal: this.handleCloseModal,
      setScanStatus: this.handleSetScanStatus,
      setCurrency: this.handleSetCurrency,
      setScannedAccounts: this.handleSetScannedAccounts,
      resetScanState: this.handleResetScanState,
      setAppOpened: this.handleSetAppOpened,
      setAccountName: this.handleSetAccountName,
      onGoStep1: this.onGoStep1,
      editedNames,
    }
    const title = <Trans i18nKey="addAccounts.title" />

    return (
      <Modal
        centered
        name={MODAL_ADD_ACCOUNTS}
        refocusWhenChange={stepId}
        onHide={() => this.setState({ ...INITIAL_STATE })}
        render={({ onClose }) => (
          <Stepper
            key={reset} // THIS IS A HACK because stepper is not controllable. FIXME
            title={title}
            initialStepId="chooseCurrency"
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
            {...stepperProps}
          >
            <Track onUnmount event="CloseModalAddAccounts" />
            <SyncSkipUnderPriority priority={100} />
          </Stepper>
        )}
      />
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AddAccounts)
