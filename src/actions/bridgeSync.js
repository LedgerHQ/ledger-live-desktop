// @flow
import type { AsyncState } from 'reducers/bridgeSync'

export const setAccountSyncState = (accountId: string, state: AsyncState) => ({
  type: 'SET_ACCOUNT_SYNC_STATE',
  accountId,
  state,
})

export const setAccountPullMoreState = (accountId: string, state: AsyncState) => ({
  type: 'SET_ACCOUNT_PULL_MORE_STATE',
  accountId,
  state,
})
