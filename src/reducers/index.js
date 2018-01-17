// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import type { LocationShape } from 'react-router'

import accounts from './accounts'
import devices from './devices'
import modals from './modals'
import update from './update'

import type { AccountsState } from './accounts'
import type { DevicesState } from './devices'
import type { ModalsState } from './modals'
import type { UpdateState } from './update'

export type State = {
  accounts: AccountsState,
  devices: DevicesState,
  modals: ModalsState,
  router: LocationShape,
  update: UpdateState,
}

export default combineReducers({
  accounts,
  devices,
  modals,
  router,
  update,
})
