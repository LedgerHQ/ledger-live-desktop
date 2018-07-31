// @flow

import fs from 'fs'
import path from 'path'

import { promisify } from 'helpers/promise'
import db from 'helpers/db'

import type { Migration } from './types'

const fsReadfile = promisify(fs.readFile)
const fsUnlink = promisify(fs.unlink)

const migrations: Migration[] = [
  {
    doc: 'merging multiple db files into one app file',
    run: async () => {
      const dbPath = db.getDBPath()
      const legacyKeys = ['accounts', 'countervalues', 'settings', 'user']
      const [accounts, countervalues, settings, user] = await Promise.all(
        legacyKeys.map(key => getLegacyData(path.join(dbPath, `${key}.json`))),
      )
      const appData = { user, settings, accounts, countervalues }
      await db.setNamespace('app', appData)
      const hasPassword = await db.getKey('app', 'settings.password.isEnabled', false)
      await db.setKey('app', 'settings.hasPassword', hasPassword)
      await db.setKey('app', 'settings.password', undefined)
      const windowParams = await db.getKey('app', 'settings.window')
      await db.setKey('app', 'settings.window', undefined)
      await db.setNamespace('windowParams', windowParams)
      await Promise.all(legacyKeys.map(key => fsUnlink(path.join(dbPath, `${key}.json`))))
    },
  },
]

async function getLegacyData(filePath) {
  let finalData
  const fileContent = await fsReadfile(filePath, 'utf-8')
  try {
    const { data } = JSON.parse(fileContent)
    finalData = data
  } catch (err) {
    // we assume we are in that case because file is encrypted
    if (err instanceof SyntaxError) {
      const buf = await fsReadfile(filePath)
      return buf.toString('base64')
    }
    throw err
  }
  return finalData
}

export default migrations
