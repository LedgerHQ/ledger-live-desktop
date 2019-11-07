const notarize = require('./notarize')
const platform = require('os').platform()

async function notarizeApp(context) {
  if (platform !== 'darwin') {
    // eslint-disable-next-line no-console
    console.log('OS is not mac, skipping app notarization.')
    return
  }

  const { appOutDir } = context
  const appName = context.packager.appInfo.productFilename
  const fullPath = `${appOutDir}/${appName}.app`

  await notarize(fullPath)
}

module.exports = notarizeApp
