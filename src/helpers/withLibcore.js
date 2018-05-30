// @flow

const core = require('@ledgerhq/ledger-core')

let instanciated = false
let queue = Promise.resolve()

// TODO: `core` should be typed
type Job = Object => Promise<any>

export default function withLibcore(job: Job) {
  if (!instanciated) {
    core.instanciateWalletPool({
      // sqlite files will be located in the app local data folder
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    })
    instanciated = true
  }
  queue = queue.then(() => {
    try {
      return job(core)
    } catch (e) {
      console.log(`withLibCore: Error in job`, e) // eslint-disable-line no-console
      return Promise.resolve()
    }
  })
  return queue
}
