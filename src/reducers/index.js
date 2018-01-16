// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import type { LocationShape } from 'react-router'

import devices from './devices'
import modals from './modals'
import update from './update'

import type { DevicesState } from './devices'
import type { ModalsState } from './modals'
import type { UpdateState } from './update'

export type State = {
  router: LocationShape,
  devices: DevicesState,
  modals: ModalsState,
  update: UpdateState,
}

export default combineReducers({
  router,
  devices,
  modals,
  update,
})
