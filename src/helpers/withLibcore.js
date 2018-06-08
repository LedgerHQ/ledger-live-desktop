// @flow

import invariant from 'invariant'

const core = require('@ledgerhq/ledger-core')

let walletPoolInstance: ?Object = null

// TODO: `core` and `NJSWalletPool` should be typed
type Job<A> = (Object, Object) => Promise<A>

export default function withLibcore<A>(job: Job<A>): Promise<A> {
  if (!walletPoolInstance) {
    walletPoolInstance = core.instanciateWalletPool({
      // sqlite files will be located in the app local data folder
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    })
  }
  const walletPool = walletPoolInstance
  invariant(walletPool, 'core.instanciateWalletPool returned null !!')

  return job(core, walletPool)
}
