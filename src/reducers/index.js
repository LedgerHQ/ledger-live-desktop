// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import type { LocationShape } from 'react-router'

import devices from './devices'
import modals from './modals'
import update from './update'
import wallets from './wallets'

import type { DevicesState } from './devices'
import type { ModalsState } from './modals'
import type { UpdateState } from './update'
import type { WalletsState } from './wallets'

export type State = {
  router: LocationShape,
  devices: DevicesState,
  modals: ModalsState,
  update: UpdateState,
  wallets: WalletsState,
}

export default combineReducers({
  devices,
  modals,
  router,
  update,
  wallets,
})
