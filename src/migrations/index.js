// @flow

import logger from 'logger'
import db from 'helpers/db'
import { delay } from 'helpers/promise'

import migrations from './migrations'

// Logic to run all the migrations based on what was not yet run:
export const runMigrations = async (): Promise<void> => {
  // Legacy: the migration nonce was previously stored in separate file
  // it can happen, so we have to check it from here also.
  const current = (await db.getKey('app', 'migrations')) || (await db.getNamespace('migrations'))

  let { nonce } = current || { nonce: migrations.length }
  const outdated = migrations.length - nonce

  if (!outdated) {
    if (!current) {
      await db.setKey('app', 'migrations.nonce', nonce)
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
    await db.setKey('app', 'migrations.nonce', nonce)
  }
}
