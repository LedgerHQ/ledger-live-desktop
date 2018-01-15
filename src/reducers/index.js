// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import devices from './devices'
import modals from './modals'

export default combineReducers({
  router,
  devices,
  modals,
})
