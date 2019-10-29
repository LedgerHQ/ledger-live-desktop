// @flow
import { isEnvDefault, changes } from '@ledgerhq/live-common/lib/env'
import type { EnvName } from '@ledgerhq/live-common/lib/env'

import { setEnvOnAllThreads } from './env'

export type FeatureCommon = {
  name: EnvName,
  title: string,
  description: string,
  shadow?: boolean,
}

export type FeatureToggle =
  | {
      type: 'toggle',
      valueOn?: any,
      valueOff?: any,
    }
  | {
      type: 'integer',
      minValue?: number,
      maxValue?: number,
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
    type: 'toggle',
    name: 'EXPERIMENTAL_USB',
    title: 'Experimental USB',
    description: 'Alternative USB implementation that might help solve USB issues.',
  },
  {
    type: 'toggle',
    name: 'LEDGER_COUNTERVALUES_API',
    valueOn: 'http://countervalue-service.dev.aws.ledger.fr',
    valueOff: 'https://countervalues.api.live.ledger.com',
    title: 'Experimental Countervalues API',
    description: 'Changing this value may break the countervalues displayed for your accounts.',
  },
  {
    type: 'integer',
    name: 'KEYCHAIN_OBSERVABLE_RANGE',
    title: 'Custom gap limit',
    description:
      'Custom gap limit for all accounts. Increasing this value above its default value (20) scans more unused public addresses for coins. Advanced users only, this may break compatibility when restoring your accounts.',
    minValue: 20,
    maxValue: 999,
  },
  {
    type: 'integer',
    name: 'FORCE_PROVIDER',
    title: 'Manager provider',
    description:
      'Changing the app provider in the Manager may make it impossible to install or uninstall apps on your Ledger device.',
    minValue: 1,
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

export const setLocalStorageEnv = (key: EnvName, val: string) => {
  const envs = getLocalStorageEnvs()
  envs[key] = val
  window.localStorage.setItem(lsKey, JSON.stringify(envs))
}

if (window.localStorage.getItem(lsKeyVersion) !== __APP_VERSION__) {
  const existing = getLocalStorageEnvs()
  // we replace all existing ones by clearing those who are gone
  const restoredEnvs = {}
  experimentalFeatures
    .filter(e => !e.shadow && e.name in existing && setEnvOnAllThreads(e.name, existing[e.name]))
    .forEach(e => {
      restoredEnvs[e.name] = existing[e.name]
    })
  window.localStorage.setItem(lsKey, JSON.stringify(restoredEnvs))
  window.localStorage.setItem(lsKeyVersion, __APP_VERSION__)
}

const envs = getLocalStorageEnvs()
/* eslint-disable guard-for-in */
for (const k in envs) {
  setEnvOnAllThreads(k, envs[k])
}
for (const k in process.env) {
  setEnvOnAllThreads(k, process.env[k])
}
/* eslint-enable guard-for-in */

changes.subscribe(({ name, value }) => {
  if (experimentalFeatures.find(f => f.name === name) && !isReadOnlyEnv(name)) {
    setLocalStorageEnv(name, value)
  }
})
