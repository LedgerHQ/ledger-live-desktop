// @flow

import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import devices from './devices'

export default combineReducers({
  router,
  devices,
})
