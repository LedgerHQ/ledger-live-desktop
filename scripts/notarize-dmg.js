const notarize = require('./notarize')
const platform = require('os').platform()

async function notarizeDmg(buildResult) {
  if (platform !== 'darwin') {
    // eslint-disable-next-line no-console
    console.log('OS is not mac, skipping dmg notarization.')
    return
  }

  const { artifactPaths } = buildResult
  const dmgPath = artifactPaths.find(path => path.match(/\.dmg$/))

  if (!dmgPath) {
    throw new Error('Impossible to notarize dmg: no dmg file in created artifacts')
  }

  notarize(dmgPath)
}

module.exports = notarizeDmg
