import fs from 'fs'
import os from 'os'
import path from 'path'
import { spawn } from 'child_process'
import rimrafModule from 'rimraf'
import { BigNumber } from 'bignumber.js'

import { promisify } from 'helpers/promise'
import { runMigrations } from 'migrations'
import { decodeAccountsModel, encodeAccountsModel } from 'reducers/accounts'
import db from 'helpers/db'

const rimraf = promisify(rimrafModule)
const fsReaddir = promisify(fs.readdir)
const fsReadFile = promisify(fs.readFile)

const tmpDir = os.tmpdir()

const accountsTransform = {
  get: decodeAccountsModel,
  set: encodeAccountsModel,
}

describe('from nonce 0', () => {
  describe('without encryption', () => {
    test('merging db files', async () => {
      const dir = await extractMock('userdata_v1.0.5_mock-01')
      db.init(dir)
      await expectFiles(dir, [
        'accounts.json',
        'countervalues.json',
        'migrations.json',
        'settings.json',
        'user.json',
      ])
      await runMigrations()
      await expectFiles(dir, ['app.json', 'windowParams.json'])
      db.init(dir)
      db.registerTransform('app', 'accounts', accountsTransform)
      const accounts = await db.getKey('app', 'accounts')
      expect(accounts.length).toBe(3)
      expect(accounts[0].balance).toBeInstanceOf(BigNumber)
      const windowParams = await db.getNamespace('windowParams')
      expect(windowParams).toEqual({
        MainWindow: {
          positions: { x: 37, y: 37 },
          dimensions: { width: 1526, height: 826 },
        },
      })
    })

    test('handle missing file without crash', async () => {
      const dir = await extractMock('userdata_v1.0.5_mock-03-missing-file')
      await expectFiles(dir, [
        'countervalues.json',
        'migrations.json',
        'settings.json',
        'user.json',
      ])
      db.init(dir)
      let err
      try {
        await runMigrations()
      } catch (e) {
        err = e
      }
      expect(err).toBeUndefined()
      await expectFiles(dir, ['app.json', 'windowParams.json'])
    })

    test('handle where app.json is already present', async () => {
      const dir = await extractMock('userdata_v1.0.5_mock-04-app-json-present')
      await expectFiles(dir, [
        'accounts.json',
        'app.json',
        'countervalues.json',
        'migrations.json',
        'settings.json',
        'user.json',
      ])
      db.init(dir)
      await runMigrations()
      await expectFiles(dir, ['app.json', 'windowParams.json'])
    })
  })

  describe('with encryption', () => {
    test('merging db files', async () => {
      const dir = await extractMock('userdata_v1.0.5_mock-02-encrypted-accounts')
      db.init(dir)
      db.registerTransform('app', 'accounts', accountsTransform)
      await runMigrations()
      await db.setEncryptionKey('app', 'accounts', 'passw0rd')
      await expectFiles(dir, ['app.json', 'windowParams.json'])
      const accounts = await db.getKey('app', 'accounts')
      expect(accounts.length).toBe(6)
      expect(accounts[0].balance).toBeInstanceOf(BigNumber)
    })

    test('migrate password setting', async () => {
      const dir = await extractMock('userdata_v1.0.5_mock-02-encrypted-accounts')
      db.init(dir)
      db.registerTransform('app', 'accounts', accountsTransform)
      await runMigrations()
      const legacyPasswordSettings = await db.getKey('app', 'settings.password')
      expect(legacyPasswordSettings).toBeUndefined()
      const hasPassword = await db.getKey('app', 'settings.hasPassword')
      expect(hasPassword).toBe(true)
    })
  })
})

describe('from nonce 1', () => {
  test('merging migration file into app file', async () => {
    const dir = await extractMock('userdata_v1.1.1_mock-01')
    await expectFiles(dir, ['app.json', 'migrations.json', 'windowParams.json'])
    const migrationsBefore = await fsReadFile(path.resolve(dir, 'migrations.json'), 'utf-8')
    expect(migrationsBefore).toBe('{"data":{"nonce":1}}')
    db.init(dir)
    db.registerTransform('app', 'accounts', accountsTransform)
    await runMigrations()
    await expectFiles(dir, ['app.json', 'windowParams.json'])
    const migrations = await db.getKey('app', 'migrations')
    expect(migrations).toEqual({ nonce: 2 })
  })
})

async function extractMock(mockName) {
  const destDirectory = path.resolve(tmpDir, mockName)
  const zipFilePath = path.resolve(__dirname, 'mocks', `${mockName}.zip`)
  await rimraf(destDirectory)
  await extractZip(zipFilePath, destDirectory)
  return destDirectory
}

function extractZip(zipFilePath, destDirectory) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('unzip', [zipFilePath, '-d', destDirectory])
    childProcess.on('close', resolve)
    childProcess.on('error', reject)
  })
}

async function expectFiles(dir, expectedFiles) {
  const files = await fsReaddir(dir)
  expect(files).toEqual(expectedFiles)
}
