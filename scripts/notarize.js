require('dotenv').config()
require('debug').enable('electron-notarize')

const platform = require('os').platform()
const { notarize } = require('electron-notarize')

async function doTheNotarization(path) {
  if (platform !== 'darwin') {
    // eslint-disable-next-line no-console
    console.log('OS is not mac, skipping notarization.')
    return
  }

  const { APPLEID, APPLEID_PASSWORD } = process.env

  if (!APPLEID || !APPLEID_PASSWORD) {
    throw new Error('APPLEID and APPLEID_PASSWORD env variable are required for notarization.')
  }

  await notarize({
    appBundleId: 'com.ledger.live',
    appPath: path,
    appleId: APPLEID,
    appleIdPassword: APPLEID_PASSWORD,
  })
}

module.exports = doTheNotarization
