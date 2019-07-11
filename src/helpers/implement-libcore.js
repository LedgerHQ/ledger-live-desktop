// @flow
import implementLibcore from '@ledgerhq/live-common/lib/libcore/platforms/nodejs'

implementLibcore({
  lib: require('@ledgerhq/ledger-core'),
  dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
})
