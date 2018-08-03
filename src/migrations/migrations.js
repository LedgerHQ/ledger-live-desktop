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
        legacyKeys.map(key => getFileData(dbPath, key)),
      )
      const appData = { user, settings, accounts, countervalues }
      await db.setNamespace('app', appData)
      const hasPassword = await db.getKey('app', 'settings.password.isEnabled', false)
      await db.setKey('app', 'settings.hasPassword', hasPassword)
      await db.setKey('app', 'settings.password', undefined)
      const windowParams = await db.getKey('app', 'settings.window')
      await db.setKey('app', 'settings.window', undefined)
      await db.setNamespace('windowParams', windowParams)
      await Promise.all(
        legacyKeys.map(async key => {
          try {
            await fsUnlink(path.join(dbPath, `${key}.json`))
          } catch (err) {} // eslint-disable-line
        }),
      )
    },
  },
  {
    doc: 'merging migrations into app.json',
    run: async () => {
      const migrations = await db.getNamespace('migrations')
      await db.setKey('app', 'migrations', migrations)
      const dbPath = db.getDBPath()
      try {
        await fsUnlink(path.resolve(dbPath, 'migrations.json'))
      } catch (err) {} // eslint-disable-line
    },
  },
]

async function getFileData(dbPath, fileName) {
  const filePath = path.join(dbPath, `${fileName}.json`)
  let finalData
  try {
    const fileContent = await fsReadfile(filePath, 'utf-8')
    const { data } = JSON.parse(fileContent)
    finalData = data
  } catch (err) {
    // we assume we are in that case because file is encrypted
    if (err instanceof SyntaxError) {
      const buf = await fsReadfile(filePath)
      return buf.toString('base64')
    }
    // will be stripped down by JSON.stringify
    return undefined
  }
  return finalData
}

export default migrations
