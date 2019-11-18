// @flow

import React, { PureComponent } from 'react'
import { MODAL_MIGRATE_ACCOUNTS } from 'config/constants'
import Modal from 'components/base/Modal'
import Stepper from 'components/base/Stepper'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { migratableAccountsSelector, accountsSelector } from 'reducers/accounts'
import logger from 'logger'
import { getCryptoCurrencyById } from '@ledgerhq/live-common/lib/currencies'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Device } from 'types/common'

import type { StepProps as DefaultStepProps, Step } from 'components/base/Stepper'
import StepOverview, { StepOverviewFooter } from './steps/01-step-overview'
import StepConnectDevice, { StepConnectDeviceFooter } from './steps/02-step-connect-device'
import StepCurrency, { StepCurrencyFooter } from './steps/03-step-currency'
import { getCurrentDevice } from '../../../reducers/devices'
import { replaceAccounts } from '../../../actions/accounts'
import { closeModal } from '../../../reducers/modals'
import { replaceStarAccountId } from '../../../actions/settings'
import { starredAccountIdsSelector } from '../../../reducers/settings'

const createSteps = () => {
  const onBack = ({ transitionTo }: StepProps) => {
    transitionTo('overview')
  }
  return [
    {
      id: 'overview',
      component: StepOverview,
      footer: StepOverviewFooter,
    },

    {
      id: 'device',
      component: StepConnectDevice,
      footer: StepConnectDeviceFooter,
      onBack,
    },
    {
      id: 'currency',
      component: StepCurrency,
      footer: StepCurrencyFooter,
    },
  ]
}

type ScanStatus = 'idle' | 'scanning' | 'error' | 'finished' | 'finished-empty'
export type StepProps = DefaultStepProps & {
  starredAccountIds: string[],
  replaceStarAccountId: ({ oldId: string, newId: string }) => void,
  currencyIds: string[],
  migratableAccounts: Account[],
  migratedAccounts: { [key: string]: Account[] },
  err: ?Error,
  accounts: Account[],
  totalMigratableAccounts: number,
  currency: ?CryptoCurrency,
  setScanStatus: (ScanStatus, ?Error) => string,
  addMigratedAccount: (CryptoCurrency, Account) => void,
  device: ?Device,
  flushMigratedAccounts: () => void,
  moveToNextCurrency: (?boolean) => void,
  getNextCurrency: () => CryptoCurrency,
  setAppOpened: (isAppOpened: boolean) => void,
  scanStatus: ScanStatus,
  isAppOpened: boolean,
  onCloseModal: () => void,
  hideLoopNotice: boolean,
}

type State = {
  stepId: string,
  isAppOpened: boolean,
  currency: ?CryptoCurrency,
  scanStatus: ScanStatus,
  err: ?Error,
  migratedAccounts: { [key: string]: Account[] },
}

const INITIAL_STATE = {
  stepId: 'overview',
  currency: null,
  isAppOpened: false,
  scanStatus: 'idle',
  err: null,
  migratedAccounts: {},
}

class MigrateAccounts extends PureComponent<*, State> {
  state = INITIAL_STATE
  componentDidMount() {
    this.handleMoveToNextCurrency()
  }

  hideLoopNotice = true
  STEPS = createSteps()

  handleStepChange = (step: Step) => this.setState({ stepId: step.id, isAppOpened: false })
  handleSetAppOpened = (isAppOpened: boolean) => this.setState({ isAppOpened })
  handleSetScanStatus = (scanStatus: ScanStatus, err: ?Error = null) => {
    if (err) {
      logger.critical(err)
    }
    this.setState({ scanStatus, err })
  }
  getNextCurrency = () => {
    const { currencyIds } = this.props
    this.hideLoopNotice = false
    const { currency } = this.state
    const nextCurrencyId = currencyIds[currencyIds.indexOf(currency && currency.id) + 1]
    return (nextCurrencyId && getCryptoCurrencyById(nextCurrencyId)) || null
  }
  handleMoveToNextCurrency = (forceNull: boolean = false) => {
    const nextCurrency = this.getNextCurrency()
    this.setState({
      currency: (!forceNull && nextCurrency) || null,
    })
  }
  handleCloseModal = () => this.props.closeModal(MODAL_MIGRATE_ACCOUNTS)
  addMigratedAccount = (currency: CryptoCurrency, account: Account) =>
    this.setState(state => {
      const alreadyMigrated = state.migratedAccounts[currency.id] || []
      return {
        migratedAccounts: {
          [currency.id]: [...alreadyMigrated, account],
        },
      }
    })

  render() {
    const {
      device,
      migratableAccounts,
      currencyIds,
      accounts,
      starredAccountIds,
      replaceAccounts,
      replaceStarAccountId,
    } = this.props
    const { stepId, isAppOpened, err, scanStatus, currency } = this.state

    const stepperProps = {
      starredAccountIds,
      replaceAccounts,
      replaceStarAccountId,
      migratableAccounts,
      currencyIds,
      accounts,
      device,
      currency,
      isAppOpened,
      err,
      scanStatus,
      addMigratedAccount: this.addMigratedAccount,
      migratedAccounts: this.state.migratedAccounts,
      hideLoopNotice: this.hideLoopNotice,
      setAppOpened: this.handleSetAppOpened,
      setScanStatus: this.handleSetScanStatus,
      moveToNextCurrency: this.handleMoveToNextCurrency,
      getNextCurrency: this.getNextCurrency,
      onCloseModal: this.handleCloseModal,
    }

    const errorSteps = err ? [2] : []
    const disableDismiss = scanStatus === 'scanning'

    return (
      <Modal
        centered
        name={MODAL_MIGRATE_ACCOUNTS}
        preventBackdropClick={disableDismiss}
        onHide={disableDismiss ? undefined : () => this.setState({ ...INITIAL_STATE })}
        render={({ onClose }) => (
          <Stepper
            hideBreadcrumb
            initialStepId={stepId}
            onStepChange={this.handleStepChange}
            onClose={onClose}
            steps={this.STEPS}
            errorSteps={errorSteps}
            {...stepperProps}
          />
        )}
      />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  device: getCurrentDevice,
  accounts: accountsSelector,
  starredAccountIds: starredAccountIdsSelector,
  migratableAccounts: migratableAccountsSelector,
  currencyIds: state =>
    migratableAccountsSelector(state)
      .reduce((c, a) => (c.includes(a.currency.id) ? c : [...c, a.currency.id]), [])
      .sort(),
})

const mapDispatchToProps = {
  replaceAccounts,
  replaceStarAccountId,
  closeModal,
}
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(MigrateAccounts)
