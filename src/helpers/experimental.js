// @flow
import { ipcRenderer } from 'electron'
import { setEnvUnsafe, isEnvDefault, changes, getAllEnvs } from '@ledgerhq/live-common/lib/env'
import type { EnvName } from '@ledgerhq/live-common/lib/env'

export type FeatureCommon = {
  name: EnvName,
  title: string,
  description: string,
  shadow?: boolean,
}

export type FeatureToggle = {
  type: 'toggle',
  valueOn?: any,
  valueOff?: any,
}

export type Feature = FeatureCommon & FeatureToggle

export const experimentalFeatures: Feature[] = [
  {
    type: 'toggle',
    name: 'EXPERIMENTAL_LANGUAGES',
    title: 'Translation testing',
    description: 'Adds unreleased languages to the language list in the general settings tab.',
  },
  {
    type: 'toggle',
    name: 'MANAGER_DEV_MODE',
    title: 'Developer mode',
    description: 'Show developer and testnet apps in the Manager.',
  },
  {
    type: 'toggle',
    name: 'SCAN_FOR_INVALID_PATHS',
    title: 'Extended account search',
    description:
      'Scan for accounts with erroneous derivation paths. Please send potentially found assets to a regular account.',
  },
  {
    shadow: true, // we'll enable it later with a better implementation
    type: 'toggle',
    name: 'EXPERIMENTAL_USB',
    title: 'Experimental USB',
    description:
      'Alternative USB implementation that might help solve USB issues. Enabling this feature might create UI glitches.',
  },
  {
    type: 'toggle',
    name: 'EXPERIMENTAL_NATIVE_SEGWIT',
    title: 'Native Segwit',
    description: 'Experimental support of Native Segwit (bech32).',
  },
  {
    type: 'toggle',
    name: 'EXPERIMENTAL_EXPLORERS',
    title: 'Experimental nodes',
    description: "Connect to Ledger's new blockchain nodes.",
  },
  {
    type: 'toggle',
    name: 'EXPERIMENTAL_LIBCORE',
    title: 'Experimental Core',
    description: 'Enable experimental Ledger lib-core features.',
  },
  {
    shadow: true,
    type: 'toggle',
    name: 'FORCE_PROVIDER',
    valueOn: 4,
    valueOff: 1,
    title: 'Pre-release apps',
    description: 'Enable pre-release apps in the Manager',
  },
  {
    type: 'toggle',
    name: 'EXPERIMENTAL_SEND_MAX',
    title: 'Experimental Send MAX',
    description:
      'Support sending the entire account balance with a MAX toggle. XRP not yet supported.',
  },
  {
    shadow: true, // not correct yet
    type: 'toggle',
    name: 'EXPERIMENTAL_ROI_CALCULATION',
    title: 'Experimental ROI calculation',
    description:
      'Changes the calculation method of the portfolio percentages by assuming that receiving crypto is a buy and sending is a sell',
  },
]

const lsKey = 'experimentalFlags'
const lsKeyVersion = `${lsKey}_llversion`

export const getLocalStorageEnvs = (): { [_: string]: any } => {
  const maybeData = window.localStorage.getItem(lsKey)
  if (!maybeData) return {}
  const obj = JSON.parse(maybeData)
  if (typeof obj !== 'object' || !obj) return {}
  Object.keys(obj).forEach(k => {
    if (!experimentalFeatures.find(f => f.name === k)) {
      delete obj[k]
    }
  })
  return obj
}

export const enabledExperimentalFeatures = (): string[] =>
  // $FlowFixMe
  experimentalFeatures.map(e => e.name).filter(k => !isEnvDefault(k))

export const isReadOnlyEnv = (key: EnvName) => key in process.env

function sendToMain() {
  ipcRenderer.send('set-envs', getAllEnvs())
}

export const setLocalStorageEnv = (key: EnvName, val: string) => {
  if (setEnvUnsafe(key, val)) {
    const envs = getLocalStorageEnvs()
    envs[key] = val
    window.localStorage.setItem(lsKey, JSON.stringify(envs))
    sendToMain()
  }
}

if (window.localStorage.getItem(lsKeyVersion) !== __APP_VERSION__) {
  const existing = getLocalStorageEnvs()
  // we replace all existing ones by clearing those who are gone
  const restoredEnvs = {}
  experimentalFeatures
    .filter(e => !e.shadow && e.name in existing && setEnvUnsafe(e.name, existing[e.name]))
    .forEach(e => {
      restoredEnvs[e.name] = existing[e.name]
    })
  window.localStorage.setItem(lsKey, JSON.stringify(restoredEnvs))
  window.localStorage.setItem(lsKeyVersion, __APP_VERSION__)
}

const envs = getLocalStorageEnvs()
/* eslint-disable guard-for-in */
for (const k in envs) {
  setEnvUnsafe(k, envs[k])
}
for (const k in process.env) {
  setEnvUnsafe(k, process.env[k])
}
/* eslint-enable guard-for-in */

sendToMain()

changes.subscribe(({ name, value }) => {
  if (experimentalFeatures.find(f => f.name === name) && !isReadOnlyEnv(name)) {
    setLocalStorageEnv(name, value)
  }
})
