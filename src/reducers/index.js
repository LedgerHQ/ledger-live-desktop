// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import type { LocationShape } from 'react-router'

import type { CounterValuesState } from '@ledgerhq/live-common/lib/countervalues/types'
import CounterValues from 'helpers/countervalues'
import accounts from './accounts'
import application from './application'
import currenciesStatus from './currenciesStatus'
import devices from './devices'
import libcore from './libcore'
import modals from './modals'
import settings from './settings'
import onboarding from './onboarding'
import bridgeSync from './bridgeSync'

import type { AccountsState } from './accounts'
import type { ApplicationState } from './application'
import type { DevicesState } from './devices'
import type { LibcoreState } from './libcore'
import type { ModalsState } from './modals'
import type { SettingsState } from './settings'
import type { OnboardingState } from './onboarding'
import type { BridgeSyncState } from './bridgeSync'
import type { CurrenciesStatusState } from './currenciesStatus'

export type State = {
  accounts: AccountsState,
  application: ApplicationState,
  countervalues: CounterValuesState,
  currenciesStatus: CurrenciesStatusState,
  devices: DevicesState,
  libcore: LibcoreState,
  modals: ModalsState,
  router: LocationShape,
  settings: SettingsState,
  onboarding: OnboardingState,
  bridgeSync: BridgeSyncState,
}

// $FlowFixMe
export default combineReducers({
  accounts,
  application,
  countervalues: CounterValues.reducer,
  currenciesStatus,
  devices,
  libcore,
  modals,
  router,
  settings,
  onboarding,
  bridgeSync,
})
