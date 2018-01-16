// @flow

import { handleActions } from 'redux-actions'

export type WalletsState = {
  currentWallet: Object | null,
}

const state: WalletsState = {
  currentWallet: null,
}

const handlers: Object = {
  SET_CURRENT_WALLET: (state: Object, { payload: currentWallet }: { payload: WalletsState }) => ({
    ...state,
    currentWallet,
  }),
}

export default handleActions(handlers, state)
