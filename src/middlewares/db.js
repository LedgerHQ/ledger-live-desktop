import db from 'helpers/db'

// eslint-disable-next-line consistent-return
export default store => next => action => {
  if (!action.type.startsWith('DB:')) {
    return next(action)
  }

  const { dispatch, getState } = store
  const [, type] = action.type.split(':')

  dispatch({ type, payload: action.payload })

  const { accounts } = getState()

  db.set('accounts', accounts.accounts)
}
