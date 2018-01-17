import get from 'lodash/get'

import db from 'helpers/db'

import { getAccounts } from 'reducers/accounts'

// eslint-disable-next-line consistent-return
export default store => next => action => {
  if (!action.type.startsWith('DB:')) {
    return next(action)
  }

  const { dispatch, getState } = store
  const [, type] = action.type.split(':')

  dispatch({ type, payload: action.payload })

  const state = getState()
  const { settings } = state

  db.settings(settings)

  const optionsAccounts = {}

  if (get(settings, 'password.state') === true) {
    optionsAccounts.encryptionKey = get(settings, 'password.value')
  }

  db.accounts(getAccounts(state), optionsAccounts)
}
