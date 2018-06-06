// @flow

import invariant from 'invariant'
import logger from 'logger'

const core = require('@ledgerhq/ledger-core')

let walletPoolInstance: ?Object = null
let queue = Promise.resolve()

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

  const p = queue.then(() => job(core, walletPool))

  queue = p.catch(e => {
    logger.warn(`withLibCore: Error in job`, e)
  })

  return p
}
