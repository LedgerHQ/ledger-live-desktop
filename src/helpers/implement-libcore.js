// @flow
import implementLibcore from '@ledgerhq/live-common/lib/libcore/platforms/nodejs'
import logger from 'logger'

implementLibcore({
  lib: require('@ledgerhq/ledger-core'),
  logger: (level, ...rest) => logger.libcore(level, ...rest),
  dbPath: process.env.LEDGER_LIVE_SQLITE_PATH,
})
