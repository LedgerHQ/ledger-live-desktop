// @flow
import implementLibcore from '@ledgerhq/live-common/lib/libcore/platforms/nodejs'

export default (password: string) => {
  implementLibcore({
    lib: require('@ledgerhq/ledger-core'),
    dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
    dbPassword: password,
  })
}
