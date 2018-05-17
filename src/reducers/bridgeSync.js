// @flow

import { createSelector } from 'reselect'
import { handleActions } from 'redux-actions'
import type { State } from 'reducers'
import { getAccounts } from './accounts'

export type AsyncState = {
  pending: boolean,
  error: ?Error,
}

export type BridgeSyncState = {
  syncs: { [accountId: string]: AsyncState },
  pullMores: { [accountId: string]: AsyncState },
}

const state: BridgeSyncState = {
  syncs: {},
  pullMores: {},
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

  SET_ACCOUNT_PULL_MORE_STATE: (
    state: BridgeSyncState,
    action: { accountId: string, state: AsyncState },
  ) => ({
    pullMores: {
      ...state.pullMores,
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

export const pullMoreStateLocalSelector = (
  bridgeSync: BridgeSyncState,
  { accountId }: { accountId: string },
) => bridgeSync.pullMores[accountId] || nothingState

export const globalSyncStateSelector = createSelector(
  getAccounts,
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

export default handleActions(handlers, state)
