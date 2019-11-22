// @flow

import { ipcRenderer } from 'electron'
import { makeLRUCache } from '@ledgerhq/live-common/lib/cache'
import { getCurrencyBridge } from '@ledgerhq/live-common/lib/bridge'
import { log } from '@ledgerhq/logs'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import { logger } from '../logger'

export function clearBridgeCache() {
  Object.keys(global.localStorage)
    .filter(k => k.startsWith('bridgeproxypreload'))
    .forEach(k => {
      global.localStorage.removeItem(k)
    })
}

function currencyCacheId(currency) {
  return `bridgeproxypreload_${currency.id}`
}

export function setCurrencyCache(currency: CryptoCurrency, data: mixed) {
  const serialized = JSON.stringify(data)
  global.localStorage.setItem(currencyCacheId(currency), serialized)
  ipcRenderer.send('hydrateCurrencyData', {
    currencyId: currency.id,
    serialized,
  })
}

export function getCurrencyCache(currency: CryptoCurrency): mixed {
  const res = global.localStorage.getItem(currencyCacheId(currency))
  if (res) {
    try {
      return JSON.parse(res)
    } catch (e) {
      log('bridge/cache', `failure to retrieve cache ${String(e)}`)
      logger.error(e)
    }
  }
  return undefined
}

export const prepareCurrency: (currency: CryptoCurrency) => Promise<void> = makeLRUCache(
  async currency => {
    const value = getCurrencyCache(currency)
    const bridge = getCurrencyBridge(currency)
    bridge.hydrate(value)
    const preloaded = await bridge.preload()
    setCurrencyCache(currency, preloaded)
  },
  currency => currency.id,
)
