// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import type { State } from 'reducers'
import { activeAccountsSelector } from './accounts'

export type AsyncState = {
  pending: boolean,
  error: ?Error,
}

export type BridgeSyncState = {
  syncs: { [accountId: string]: AsyncState },
}

const initialState: BridgeSyncState = {
  syncs: {},
}

const handlers: Object = {
  SET_ACCOUNT_SYNC_STATE: (
    state: BridgeSyncState,
    action: {
      accountId: string,
      state: AsyncState,
    },
  ) => ({
    syncs: {
      ...state.syncs,
      [action.accountId]: action.state,
    },
  }),
}

// Selectors

export const bridgeSyncSelector = (state: State) => state.bridgeSync

const nothingState = { pending: false, error: null }

export const syncStateLocalSelector = (
  bridgeSync: BridgeSyncState,
  { accountId }: { accountId: string },
) => bridgeSync.syncs[accountId] || nothingState

export const accountSyncStateSelector = (s: State, o: { accountId: string }): AsyncState =>
  syncStateLocalSelector(bridgeSyncSelector(s), o)

export const globalSyncStateSelector = createSelector(
  activeAccountsSelector,
  bridgeSyncSelector,
  (accounts, bridgeSync) => {
    const globalSyncState: AsyncState = {
      pending: false,
      error: null,
    }
    for (const account of accounts) {
      const syncState = syncStateLocalSelector(bridgeSync, { accountId: account.id })
      if (syncState.error) globalSyncState.error = syncState.error
      if (syncState.pending) globalSyncState.pending = true
    }
    return globalSyncState
  },
)

export default handleActions(handlers, initialState)
