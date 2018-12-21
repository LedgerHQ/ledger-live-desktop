import os from 'os'
import path from 'path'
import rimrafModule from 'rimraf'

import db from 'helpers/db'
import { promisify } from 'helpers/promise'
import { fsReadFile, fsWriteFile, fsMkdir } from 'helpers/fs'

const rimraf = promisify(rimrafModule)

const accountsTransform = {
  get: accounts => accounts.map(account => ({ ...account, balance: Number(account.balance) })),
  set: accounts => accounts.map(account => ({ ...account, balance: account.balance.toString() })),
}

const fakeAccounts = [{ name: 'a', balance: 100 }, { name: 'b', balance: 200 }]

async function createRandomTmpDir() {
  const p = path.resolve(os.tmpdir(), `tmp-${Math.random()}`)
  await rimraf(p)
  await fsMkdir(p)
  return p
}

describe('db - without init', () => {
  test('throw if trying to get key while db not initiated', async () => {
    let err
    try {
      await db.getKey('app', 'accounts')
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect(err.name).toBe('NoDBPathGiven')
  })

  test('handle the case where db file does not exists', async () => {
    let err
    try {
      const dbPath = await createRandomTmpDir()
      db.init(dbPath)
      const dbContent = await db.load('app')
      expect(dbContent).toEqual({})
      await rimraf(dbPath)
    } catch (e) {
      err = e
    }
    expect(err).toBeUndefined()
  })
})

describe('db', () => {
  const dbPath = path.resolve(os.tmpdir(), 'ledger-live-test-db')

  beforeEach(async () => {
    await rimraf(dbPath)
    await fsMkdir(dbPath)
    db.init(dbPath)
  })

  test('set and get key', async () => {
    const a = await db.getKey('app', 'something')
    expect(a).toBeUndefined()
    await db.setKey('app', 'something', 'foo')
    const b = await db.getKey('app', 'something')
    expect(b).toBe('foo')
  })

  test('set and get key, even if nested', async () => {
    await db.setKey('app', 'something.is.good', 'foo')
    const a = await db.getKey('app', 'something.is.good')
    expect(a).toBe('foo')
  })

  test('get the whole namespace', async () => {
    await db.setKey('app', 'something.is.good', 'foo')
    const a = await db.getNamespace('app')
    expect(a).toEqual({ something: { is: { good: 'foo' } } })
  })

  test('set the whole namespace', async () => {
    await db.setNamespace('app', { foo: 'bar' })
    const a = await db.getNamespace('app')
    expect(a).toEqual({ foo: 'bar' })
  })

  test('handle default value if value not set', async () => {
    const a = await db.getKey('app', 'something.is.good', 57)
    expect(a).toBe(57)
  })

  test('encrypt data to filesystem', async () => {
    const data = { this: 'is', sparta: true }
    let content
    let parsed

    // let's try without encrypting
    await db.setKey('app', 'shouldBeEncrypted', data)
    const filePath = path.resolve(dbPath, 'app.json')
    content = await fsReadFile(filePath, 'utf-8')
    parsed = JSON.parse(content).data
    expect(parsed.shouldBeEncrypted).toEqual(data)

    // mark the field as encrypted
    await db.setEncryptionKey('app', 'shouldBeEncrypted', 'passw0rd')

    // let's see if it worked
    content = await fsReadFile(filePath, 'utf-8')
    parsed = JSON.parse(content).data
    const expected = '+UexwDUPgM8mYaandbTUzTMdmZDe+/yd77zOLCHcIWk='
    expect(parsed.shouldBeEncrypted).toEqual(expected)
  })

  test('retrieve encrypted data, after db load', async () => {
    const tmpDir = path.resolve(os.tmpdir(), 'with-encrypted-field')
    await rimraf(tmpDir)
    await fsMkdir(tmpDir)
    const encryptedData =
      '{"data":{ "shouldBeEncrypted": "+UexwDUPgM8mYaandbTUzTMdmZDe+/yd77zOLCHcIWk=" }}'
    await fsWriteFile(path.resolve(tmpDir, 'app.json'), encryptedData)
    db.init(tmpDir)
    const encrypted = await db.getKey('app', 'shouldBeEncrypted')
    expect(encrypted).toBe('+UexwDUPgM8mYaandbTUzTMdmZDe+/yd77zOLCHcIWk=')
    await db.setEncryptionKey('app', 'shouldBeEncrypted', 'passw0rd')
    const decoded = await db.getKey('app', 'shouldBeEncrypted')
    expect(decoded).toEqual({ this: 'is', sparta: true })
    await rimraf(tmpDir)
  })

  test('handle wrong encryption key', async () => {
    await db.setKey('app', 'foo', { some: 'data' })
    await db.setEncryptionKey('app', 'foo', 'passw0rd')

    db.init(dbPath)

    const d = await db.getKey('app', 'foo.some')
    expect(d).toBe(undefined)
    let err
    try {
      await db.setEncryptionKey('app', 'foo', 'totally not the passw0rd')
    } catch (e) {
      err = e
    }
    expect(err).toBeDefined()
    expect(err.name).toBe('DBWrongPassword')
    await db.setEncryptionKey('app', 'foo', 'passw0rd')
    const e = await db.getKey('app', 'foo.some')
    expect(e).toBe('data')
  })

  test('detect if field is encrypted or not', async () => {
    let isDecrypted
    await db.setKey('app', 'encryptedField', { some: 'data' })
    await db.setEncryptionKey('app', 'encryptedField', 'passw0rd')
    db.init(dbPath)
    const k = await db.getKey('app', 'encryptedField')
    expect(k).toBe('HNEETQf+9An6saxmA/X8zg==')
    isDecrypted = await db.hasBeenDecrypted('app', 'encryptedField')
    expect(isDecrypted).toBe(false)
    await db.setEncryptionKey('app', 'encryptedField', 'passw0rd')
    isDecrypted = await db.hasBeenDecrypted('app', 'encryptedField')
    expect(isDecrypted).toBe(true)
    const value = await db.getKey('app', 'encryptedField')
    expect(value).toEqual({ some: 'data' })
  })

  test('handle transformations', async () => {
    db.registerTransform('app', 'accounts', accountsTransform)
    await db.setKey('app', 'accounts', fakeAccounts)
    const filePath = path.resolve(dbPath, 'app.json')
    const fileContent = await fsReadFile(filePath, 'utf-8')

    // expect transform to have written strings
    const expectedFile =
      '{"data":{"accounts":[{"name":"a","balance":"100"},{"name":"b","balance":"200"}]}}'
    expect(fileContent).toBe(expectedFile)

    db.init(dbPath)
    db.registerTransform('app', 'accounts', accountsTransform)

    // expect transform to have loaded numbers
    const accounts = await db.getKey('app', 'accounts')
    expect(accounts).toEqual(fakeAccounts)
  })

  test('can handle transform on an encrypted field', async () => {
    let accounts
    db.registerTransform('app', 'accounts', accountsTransform)
    await db.setEncryptionKey('app', 'accounts', 'passw0rd')
    await db.setKey('app', 'accounts', fakeAccounts)
    accounts = await db.getKey('app', 'accounts')
    expect(accounts).toEqual(fakeAccounts)
    db.init(dbPath)
    db.registerTransform('app', 'accounts', accountsTransform)
    await db.setEncryptionKey('app', 'accounts', 'passw0rd')
    accounts = await db.getKey('app', 'accounts')
    expect(accounts).toEqual(fakeAccounts)
  })

  test('check if password is correct', async () => {
    let isEncryptionKeyCorrect
    await db.setEncryptionKey('app', 'verySecureField', 'h0dl')
    await db.setKey('app', 'verySecureField', { much: { secure: { data: true } } })
    const filePath = path.resolve(dbPath, 'app.json')
    const content = await fsReadFile(filePath, 'utf-8')
    const expected =
      '{"data":{"verySecureField":"i9SyvjaWm/UVpmuyeChmKjSuiWJuMxEJhhvUhvleRoe6gpAOgBWqREB+CRO6yxkD"}}'
    expect(content).toBe(expected)
    isEncryptionKeyCorrect = db.isEncryptionKeyCorrect('app', 'verySecureField', 'h0dl')
    expect(isEncryptionKeyCorrect).toBe(true)
    isEncryptionKeyCorrect = db.isEncryptionKeyCorrect('app', 'verySecureField', 'never-h0dl')
    expect(isEncryptionKeyCorrect).toBe(false)
  })

  test('inform is a field has an encryption key', async () => {
    let hasEncryptionKey
    await db.setEncryptionKey('app', 'verySecureField', 'h0dl')
    hasEncryptionKey = db.hasEncryptionKey('app', 'verySecureField')
    expect(hasEncryptionKey).toBe(true)
    hasEncryptionKey = db.hasEncryptionKey('app', 'veryInexistantField')
    expect(hasEncryptionKey).toBe(false)
  })
})
