// @flow

import logger from 'logger'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import type { Migration } from './types'

export const migrations: Migration[] = [
  /*
  // TODO release when libcore will fix the issue (ensure it does everyting that is needed)
  {
    doc: 'libcore fixed an important bug on BCH that needs a cache clear',
    run: async () => {
      // Clear out accounts operations because will need a full refresh
      const accounts: mixed = db.get('accounts')
      if (accounts && Array.isArray(accounts)) {
        for (const acc of accounts) {
          if (acc && typeof acc === 'object') {
            acc.operations = []
            acc.pendingOperations = []
          }
        }
        db.set('accounts', accounts)
      }

      db.cleanCache()
      // await delay(500)
    },
  },
  */
]

// Logic to run all the migrations based on what was not yet run:
export const runMigrations = async (): Promise<void> => {
  const current = db.get('migrations')
  let { nonce } = current || { nonce: migrations.length }
  const outdated = migrations.length - nonce

  if (!outdated) {
    if (!current) {
      db.set('migrations', { nonce })
    }
    return
  }

  try {
    await delay(1000) // wait a bit the logger to be ready.

    while (nonce < migrations.length) {
      const m = migrations[nonce]
      logger.log(`migration ${nonce}: ${m.doc}`)
      await m.run()
      nonce++
    }
    logger.log(`${outdated} migration(s) performed.`)
  } finally {
    db.set('migrations', { nonce })
  }
}
