// @flow

const core = require('@ledgerhq/ledger-core')

let walletPool = null
let queue = Promise.resolve()

// TODO: `core` and `NJSWalletPool` should be typed
type Job = (Object, Object) => any

export default function withLibcore(job: Job) {
  if (!walletPool) {
    walletPool = core.instanciateWalletPool({
      // sqlite files will be located in the app local data folder
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    })
  }
  // $FlowFixMe WTF is happening here, dudes.
  queue = queue.then(async () => {
    try {
      if (!walletPool) {
        throw new Error('wallet pool not instanciated. this should not happen')
      }
      return job(core, walletPool)
    } catch (e) {
      console.log(`withLibCore: Error in job`, e) // eslint-disable-line no-console
      return Promise.resolve()
    }
  })
  return queue
}
