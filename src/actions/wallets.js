// @flow

/* eslint-disable import/prefer-default-export */

export type SetCurrentWalletType = (Object | null) => { type: string, payload: Object | null }
export const setCurrentWallet: SetCurrentWalletType = payload => ({
  type: 'SET_CURRENT_WALLET',
  payload,
})
