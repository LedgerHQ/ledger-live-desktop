// Yep. That's a singleton.
//
// Electron needs to tell lib ledger core where to store the sqlite files, when
// instanciating wallet pool, but we don't need to do each everytime we
// require ledger-core, only the first time, so, eh.

const core = require('ledger-core')

let instanciated = false

module.exports = () => {
  console.log(`INSTANCIATED = ${instanciated}`)
  if (!instanciated) {
    core.instanciateWalletPool({
      // sqlite files will be located in the app local data folder
      dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    })
    instanciated = true
  }
  return core
}
