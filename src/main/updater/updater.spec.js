import path from 'path'
import crypto from 'crypto'

import { fsReadFile } from 'helpers/fs'
import { UpdateIncorrectHash, UpdateIncorrectSig } from 'config/errors'
import createMockAppUpdater from './createMockAppUpdater'
import { sha512sumPath, readUpdateInfos } from './createElectronAppUpdater'
import * as pgpHelper from './pgpHelper'

const base = path.resolve(__dirname, 'mocks')

describe('AppUpdater', () => {
  describe('simple cases', () => {
    test('should not throw if correct hash & correct sig', async () => {
      await verifyMockFolder('sigok-shasumok', 'pubkey-1.asc')
    })

    test('should throw if correct hash but incorrect pubkey', async () => {
      const p = verifyMockFolder('sigok-shasumok', 'pubkey-2.asc')
      await expectFail(p, UpdateIncorrectSig)
    })

    test('should throw if incorrect hash but correct sig', async () => {
      const p = verifyMockFolder('sigok-shasumko', 'pubkey-1.asc')
      await expectFail(p, UpdateIncorrectHash)
    })

    test('should throw if correct hash but incorrect sig', async () => {
      const p = verifyMockFolder('sigko-shasumok', 'pubkey-1.asc')
      await expectFail(p, UpdateIncorrectSig)
    })
  })

  describe('key invalidation', () => {
    test('should verify successfully by using getNextKey()', async () => {
      const filename = 'foo.exe'
      const mockPrivKey1 = await fsReadFile(path.resolve(base, 'mock-privkey-1.asc'), 'ascii')
      const mockPubKey1 = await fsReadFile(path.resolve(base, 'mock-pubkey-1.asc'), 'ascii')
      const mockPrivKey2 = await fsReadFile(path.resolve(base, 'mock-privkey-2.asc'), 'ascii')
      const mockPubKey2 = await fsReadFile(path.resolve(base, 'mock-pubkey-2.asc'), 'ascii')

      // This is the desired scenario:
      //
      // Let's simulate a release.
      //
      // 1) create binary (lol) and its hash. this is basically the app update
      const update = '0010011-content-of-the-app-01110001010111'

      // 2) create hash of update
      const hash = sha512sum(update)
      const hashFile = `${hash}  ${filename}` // yeah, the hash file contains also file name

      // 3) sign the hash with the *KEY 2* (the app will use the *KEY 1* first)
      const signature = await pgpHelper.sign(hashFile, mockPrivKey2)

      // 4) sign *KEY 2* with *KEY 1* and get the *KEY 1* fingerprint, ye.
      const mockPubKey2Signature = await pgpHelper.sign(mockPubKey2, mockPrivKey1)
      const mockPubKey1Fingerprint = await pgpHelper.getFingerprint(mockPubKey1)

      // 5) app updater, with all thoses infos
      const updater = await createMockAppUpdater({
        filename,
        computedHash: hash,
        hashFile,
        signature,
        pubKey: mockPubKey1,
        pubKeys: [
          {
            fingerprint: mockPubKey1Fingerprint,
            content: mockPubKey2,
            signature: mockPubKey2Signature,
          },
        ],
      })

      await updater.verify()
    })
  })
})

async function expectFail(promise, errType) {
  let err
  try {
    await promise
  } catch (e) {
    err = e
  }
  expect(err).toBeDefined()
  expect(err).toBeInstanceOf(errType)
}

async function verifyMockFolder(folderName, pubKeyName, pubKeys = []) {
  const mock = path.resolve(base, folderName)
  const { fileName: filename } = await readUpdateInfos(mock)
  const computedHash = await sha512sumPath(path.resolve(mock, filename))
  const hashFile = await fsReadFile(path.resolve(mock, `${filename}.sha512sum`), 'ascii')
  const signature = await fsReadFile(path.resolve(mock, `${filename}.sha512sum.sig`), 'ascii')
  const pubKey = await fsReadFile(path.resolve(base, pubKeyName))
  const updater = await createMockAppUpdater({
    filename,
    computedHash,
    hashFile,
    signature,
    pubKey,
    pubKeys,
  })
  await updater.verify()
}

export function sha512sum(content) {
  const sum = crypto.createHash('sha512')
  sum.update(content)
  return sum.digest('hex')
}
