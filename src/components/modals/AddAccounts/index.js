// @flow

import invariant from 'invariant'
import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { createStructuredSelector } from 'reselect'

import SyncSkipUnderPriority from 'components/SyncSkipUnderPriority'

import type { Currency, Account } from '@ledgerhq/live-common/lib/types'

import { MODAL_ADD_ACCOUNTS } from 'config/constants'
import type { T, Device } from 'types/common'

import { getCurrentDevice } from 'reducers/devices'
import { accountsSelector } from 'reducers/accounts'
import { addAccount } from 'actions/accounts'
import { closeModal } from 'reducers/modals'

import Modal, { ModalContent, ModalTitle, ModalFooter, ModalBody } from 'components/base/Modal'
import Box from 'components/base/Box'
import Breadcrumb from 'components/Breadcrumb'

import StepChooseCurrency, { StepChooseCurrencyFooter } from './steps/01-step-choose-currency'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepImport, { StepImportFooter } from './steps/03-step-import'
import StepFinish from './steps/04-step-finish'

const createSteps = ({ t }: { t: T }) => [
  {
    id: 'chooseCurrency',
    label: t('app:addAccounts.breadcrumb.informations'),
    component: StepChooseCurrency,
    footer: StepChooseCurrencyFooter,
    onBack: null,
    hideFooter: false,
  },
  {
    id: 'connectDevice',
    label: t('app:addAccounts.breadcrumb.connectDevice'),
    component: StepConnectDevice,
    footer: StepConnectDeviceFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo('chooseCurrency'),
    hideFooter: false,
  },
  {
    id: 'import',
    label: t('app:addAccounts.breadcrumb.import'),
    component: StepImport,
    footer: StepImportFooter,
    onBack: ({ transitionTo }: StepProps) => transitionTo('chooseCurrency'),
    hideFooter: false,
  },
  {
    id: 'finish',
    label: t('app:addAccounts.breadcrumb.finish'),
    component: StepFinish,
    footer: null,
    onBack: null,
    hideFooter: true,
  },
]

type Props = {
  t: T,
  currentDevice: ?Device,
  existingAccounts: Account[],
  closeModal: string => void,
  addAccount: Account => void,
}

type StepId = 'chooseCurrency' | 'connectDevice' | 'import' | 'finish'
type ScanStatus = 'idle' | 'scanning' | 'error' | 'finished'

type State = {
  stepId: StepId,
  isAppOpened: boolean,
  currency: ?Currency,

  // scan process
  scannedAccounts: Account[],
  checkedAccountsIds: string[],
  scanStatus: ScanStatus,
  err: ?Error,
}

export type StepProps = {
  t: T,
  currency: ?Currency,
  currentDevice: ?Device,
  isAppOpened: boolean,
  transitionTo: StepId => void,
  setState: any => void,
  onClickAdd: void => Promise<void>,
  onCloseModal: void => void,

  // scan process
  scannedAccounts: Account[],
  existingAccounts: Account[],
  checkedAccountsIds: string[],
  scanStatus: ScanStatus,
  err: ?Error,
}

const mapStateToProps = createStructuredSelector({
  currentDevice: getCurrentDevice,
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
  err: null,
  scanStatus: 'idle',
}

class AddAccounts extends PureComponent<Props, State> {
  state = INITIAL_STATE
  STEPS = createSteps({
    t: this.props.t,
  })

  transitionTo = stepId => {
    const { currency } = this.state
    let nextState = { stepId }
    if (stepId === 'chooseCurrency') {
      nextState = { ...INITIAL_STATE, currency }
    }
    this.setState(nextState)
  }

  handleClickAdd = async () => {
    const { addAccount } = this.props
    const { scannedAccounts, checkedAccountsIds } = this.state
    const accountsIdsMap = checkedAccountsIds.reduce((acc, cur) => {
      acc[cur] = true
      return acc
    }, {})
    const accountsToAdd = scannedAccounts.filter(account => accountsIdsMap[account.id] === true)
    for (let i = 0; i < accountsToAdd.length; i++) {
      await idleCallback()
      addAccount(accountsToAdd[i])
    }
    this.transitionTo('finish')
  }

  handleCloseModal = () => {
    const { closeModal } = this.props
    closeModal(MODAL_ADD_ACCOUNTS)
  }

  render() {
    const { t, currentDevice, existingAccounts } = this.props
    const {
      stepId,
      currency,
      isAppOpened,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
    } = this.state

    const stepIndex = this.STEPS.findIndex(s => s.id === stepId)
    const step = this.STEPS[stepIndex]

    invariant(step, `AddAccountsModal: step ${stepId} doesn't exists`)

    const { component: StepComponent, footer: StepFooter, hideFooter, onBack } = step

    const stepProps: StepProps = {
      t,
      currency,
      currentDevice,
      existingAccounts,
      scannedAccounts,
      checkedAccountsIds,
      scanStatus,
      err,
      isAppOpened,
      onClickAdd: this.handleClickAdd,
      onCloseModal: this.handleCloseModal,
      transitionTo: this.transitionTo,
      setState: (...args) => this.setState(...args),
    }

    return (
      <Modal
        name={MODAL_ADD_ACCOUNTS}
        refocusWhenChange={stepId}
        onHide={() => this.setState({ ...INITIAL_STATE })}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <SyncSkipUnderPriority priority={100} />
            <ModalTitle onBack={onBack ? () => onBack(stepProps) : void 0}>
              {t('app:addAccounts.title')}
            </ModalTitle>
            <ModalContent>
              <Breadcrumb mb={6} currentStep={stepIndex} items={this.STEPS} />
              <StepComponent {...stepProps} />
            </ModalContent>
            {!hideFooter && (
              <ModalFooter horizontal align="center" justify="flex-end" style={{ height: 80 }}>
                {StepFooter ? <StepFooter {...stepProps} /> : <Box/>}
              </ModalFooter>
            )}
          </ModalBody>
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

function idleCallback() {
  return new Promise(resolve => window.requestIdleCallback(resolve))
}
