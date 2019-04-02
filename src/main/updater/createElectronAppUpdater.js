// @flow

import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

import network from 'api/network'
import { fsReadFile } from 'helpers/fs'
import { UpdateFetchFileFail } from './errors'
import createAppUpdater from './createAppUpdater'

import pubKey from './ledger-pubkey'

export default async ({ feedURL, updateVersion }: { feedURL: string, updateVersion: string }) => {
  const { app } = require('electron')
  const updateFolder = path.resolve(app.getPath('userData'), '__update__')
  const { fileName: filename } = await readUpdateInfos(updateFolder)

  const hashFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum`
  const hashSigFileURL = `${feedURL}/ledger-live-desktop-${updateVersion}.sha512sum.sig`
  const keysURL = `${feedURL}/pubkeys`

  return createAppUpdater({
    filename,
    computeHash: () => sha512sumPath(path.resolve(updateFolder, filename)),
    getHashFile: () => getDistantFileContent(hashFileURL),
    getHashFileSignature: () => getDistantFileContent(hashSigFileURL),
    getNextKey: (fingerprint: ?string) =>
      fingerprint ? getDistantFileContent(`${keysURL}/${fingerprint}.asc`) : pubKey,
    getNextKeySignature: async (fingerprint: string) =>
      getDistantFileContent(`${keysURL}/${fingerprint}.asc.sig`),
  })
}

// read the electron-updater file. we basically only need the filename here,
// because the hash file contains hashes for all platforms (better to have
// only 1 file to sign lel)
export async function readUpdateInfos(updateFolder: string) {
  const updateInfoPath = path.resolve(updateFolder, 'update-info.json')
  const updateInfoContent = await fsReadFile(updateInfoPath)
  return JSON.parse(updateInfoContent)
}

// compute hash for given path. i guess we only need that here
export function sha512sumPath(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const sum = crypto.createHash('sha512')
    const stream = fs.createReadStream(filePath)
    stream.on('data', data => sum.update(data))
    stream.on('end', () => resolve(sum.digest('hex')))
    stream.on('error', reject)
  })
}

async function getDistantFileContent(url: string) {
  try {
    const res = await network({ method: 'GET', url })
    return res.data
  } catch (err) {
    throw new UpdateFetchFileFail(url)
  }
}
