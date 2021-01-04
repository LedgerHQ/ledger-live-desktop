// @flow
import { ipcRenderer } from "electron";
import { makeBridgeCacheSystem } from "@ledgerhq/live-common/lib/bridge/cache";
import { log } from "@ledgerhq/logs";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { logger } from "~/logger";

export function clearBridgeCache() {
  Object.keys(global.localStorage)
    .filter(k => k.startsWith("bridgeproxypreload"))
    .forEach(k => {
      global.localStorage.removeItem(k);
    });
}

function currencyCacheId(currency) {
  return `bridgeproxypreload_${currency.id}`;
}

export function setCurrencyCache(currency: CryptoCurrency, data: mixed) {
  if (data) {
    const serialized = JSON.stringify(data);
    global.localStorage.setItem(currencyCacheId(currency), serialized);
    ipcRenderer.send("hydrateCurrencyData", {
      currencyId: currency.id,
      serialized,
    });
  }
}

export function getCurrencyCache(currency: CryptoCurrency): mixed {
  const res = global.localStorage.getItem(currencyCacheId(currency));
  if (res && res !== "undefined") {
    try {
      return JSON.parse(res);
    } catch (e) {
      log("bridge/cache", `failure to retrieve cache ${String(e)}`);
      logger.error(e);
    }
  }
  return undefined;
}

const cache = makeBridgeCacheSystem({
  saveData(c, d) {
    setCurrencyCache(c, d);
    return Promise.resolve();
  },
  getData(c) {
    return Promise.resolve(getCurrencyCache(c));
  },
});

export const hydrateCurrency = cache.hydrateCurrency;
export const prepareCurrency = cache.prepareCurrency;
