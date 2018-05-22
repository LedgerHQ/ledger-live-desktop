// @flow

import type { IPCSend } from 'types/electron'

import scanAccountsOnDevice from './scanAccountsOnDevice'
import signAndBroadcastTransactionBTCLike from './signAndBroadcastTransaction/btc'

import sync from './sync'

export default {
  sync,
  signAndBroadcastTransactionBTCLike,
  scan: async (
    send: IPCSend,
    {
      devicePath,
      currencyId,
    }: {
      devicePath: string,
      currencyId: string,
    },
  ) => {
    try {
      send('accounts.scanAccountsOnDevice.start', { pid: process.pid }, { kill: false })
      const accounts = await scanAccountsOnDevice({
        devicePath,
        currencyId,
        onAccountScanned: account => {
          send('accounts.scanAccountsOnDevice.accountScanned', account, { kill: false })
        },
      })
      send('accounts.scanAccountsOnDevice.success', accounts)
    } catch (err) {
      send('accounts.scanAccountsOnDevice.fail', formatErr(err))
    }
  },
}

// TODO: move this to a helper
function formatErr(err) {
  if (err instanceof Error) {
    return err.message || err.code
  }
  if (typeof err === 'string') {
    return err
  }
  return 'unknown error'
}
