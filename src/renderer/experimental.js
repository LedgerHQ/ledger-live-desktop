// @flow
import React from "react";
import { findCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import { getExplorerConfig } from "@ledgerhq/live-common/lib/api/explorerConfig";
import { isEnvDefault, changes } from "@ledgerhq/live-common/lib/env";
import type { EnvName } from "@ledgerhq/live-common/lib/env";
import { Trans } from "react-i18next";

import { setEnvOnAllThreads } from "./../helpers/env";

export type FeatureCommon = {
  name: EnvName,
  title: string | React$Node,
  description: string | React$Node,
  shadow?: boolean,
  dirty?: boolean, // NB Will trigger a clear cache if changed
};

export type FeatureToggle =
  | {
      type: "toggle",
      valueOn?: any,
      valueOff?: any,
    }
  | {
      type: "integer",
      minValue?: number,
      maxValue?: number,
    };

export type Feature = FeatureCommon & FeatureToggle;

const explorerConfig = getExplorerConfig();
const deltaExperimentalExplorers = Object.keys(explorerConfig)
  .map(currencyId => {
    const c = findCryptoCurrencyById(currencyId);
    if (!c || c.terminated) return null;
    const config = explorerConfig[currencyId];
    if (!config || !config.experimental) return null;
    return [c, config];
  })
  .filter(Boolean);

// comma-separated list of currencies that we want to enable as experimental, e.g:
// const experimentalCurrencies = "solana,cardano";
const experimentalCurrencies = "";

export const experimentalFeatures: Feature[] = [
  {
    type: "toggle",
    name: "EXPERIMENTAL_CURRENCIES_JS_BRIDGE",
    title: <Trans i18nKey="settings.experimental.features.experimentalJSCurrencies.title" />,
    description: (
      <Trans i18nKey="settings.experimental.features.experimentalJSCurrencies.description" />
    ),
    valueOn: "tezos,algorand",
    valueOff: "",
  },
  ...(experimentalCurrencies.length
    ? [
        {
          type: "toggle",
          name: "EXPERIMENTAL_CURRENCIES",
          title: <Trans i18nKey="settings.experimental.features.experimentalCurrencies.title" />,
          description: (
            <Trans i18nKey="settings.experimental.features.experimentalCurrencies.description" />
          ),
          valueOn: experimentalCurrencies,
          valueOff: "",
        },
      ]
    : []),
  ...(deltaExperimentalExplorers.length
    ? [
        {
          type: "toggle",
          name: "EXPERIMENTAL_EXPLORERS",
          title: <Trans i18nKey="settings.experimental.features.experimentalExplorers.title" />,
          description: (
            <Trans i18nKey="settings.experimental.features.experimentalExplorers.description">
              {deltaExperimentalExplorers
                .map(
                  ([currency, config]) =>
                    (currency.isTestnetFor ? "t" : "") +
                    currency.ticker +
                    " " +
                    config.stable.version +
                    "->" +
                    (config.experimental?.version || "?"),
                )
                .join(", ")}
            </Trans>
          ),
        },
      ]
    : []),
  {
    type: "toggle",
    name: "API_TRONGRID_PROXY",
    title: <Trans i18nKey="settings.experimental.features.apiTrongridProxy.title" />,
    description: <Trans i18nKey="settings.experimental.features.apiTrongridProxy.description" />,
    valueOn: "https://api.trongrid.io",
    valueOff: "https://tron.coin.ledger.com",
  },
  {
    type: "toggle",
    name: "EXPERIMENTAL_LANGUAGES",
    title: <Trans i18nKey="settings.experimental.features.experimentalLanguages.title" />,
    description: (
      <Trans i18nKey="settings.experimental.features.experimentalLanguages.description" />
    ),
  },
  {
    type: "toggle",
    name: "MANAGER_DEV_MODE",
    title: <Trans i18nKey="settings.experimental.features.managerDevMode.title" />,
    description: <Trans i18nKey="settings.experimental.features.managerDevMode.description" />,
  },
  {
    type: "toggle",
    name: "SCAN_FOR_INVALID_PATHS",
    title: <Trans i18nKey="settings.experimental.features.scanForInvalidPaths.title" />,
    description: <Trans i18nKey="settings.experimental.features.scanForInvalidPaths.description" />,
  },
  {
    type: "toggle",
    name: "LEDGER_COUNTERVALUES_API",
    title: "Experimental countervalues API",
    description:
      "This may cause the countervalues displayed for your accounts to become incorrect.",
    valueOn: "https://countervalues.live.ledger.com",
    valueOff: "https://countervalues-experimental.live.ledger.com",
  },
  {
    type: "integer",
    name: "KEYCHAIN_OBSERVABLE_RANGE",
    title: <Trans i18nKey="settings.experimental.features.keychainObservableRange.title" />,
    description: (
      <Trans i18nKey="settings.experimental.features.keychainObservableRange.description" />
    ),
    minValue: 20,
    maxValue: 999,
    dirty: true,
  },
  {
    type: "integer",
    name: "FORCE_PROVIDER",
    title: <Trans i18nKey="settings.experimental.features.forceProvider.title" />,
    description: <Trans i18nKey="settings.experimental.features.forceProvider.description" />,
    minValue: 1,
  },
];

const lsKey = "experimentalFlags";
const lsKeyVersion = `${lsKey}_llversion`;

export const getLocalStorageEnvs = (): { [_: string]: any } => {
  const maybeData = window.localStorage.getItem(lsKey);
  if (!maybeData) return {};
  const obj = JSON.parse(maybeData);
  if (typeof obj !== "object" || !obj) return {};
  Object.keys(obj).forEach(k => {
    if (!experimentalFeatures.find(f => f.name === k)) {
      delete obj[k];
    }
  });
  return obj;
};

export const enabledExperimentalFeatures = (): string[] =>
  // $FlowFixMe
  experimentalFeatures.map(e => e.name).filter(k => !isEnvDefault(k));

export const isReadOnlyEnv = (key: EnvName) => key in process.env;

export const setLocalStorageEnv = (key: EnvName, val: string) => {
  const envs = getLocalStorageEnvs();
  envs[key] = val;
  window.localStorage.setItem(lsKey, JSON.stringify(envs));
};

if (window.localStorage.getItem(lsKeyVersion) !== __APP_VERSION__) {
  const existing = getLocalStorageEnvs();
  // we replace all existing ones by clearing those who are gone
  const restoredEnvs = {};
  experimentalFeatures
    .filter(e => !e.shadow && e.name in existing && setEnvOnAllThreads(e.name, existing[e.name]))
    .forEach(e => {
      restoredEnvs[e.name] = existing[e.name];
    });
  window.localStorage.setItem(lsKey, JSON.stringify(restoredEnvs));
  window.localStorage.setItem(lsKeyVersion, __APP_VERSION__);
}

const envs = getLocalStorageEnvs();
/* eslint-disable guard-for-in */
for (const k in envs) {
  setEnvOnAllThreads(k, envs[k]);
}
for (const k in process.env) {
  setEnvOnAllThreads(k, process.env[k]);
}
/* eslint-enable guard-for-in */

let lastChange = 0;

export function recentlyChangedExperimental() {
  return Date.now() - lastChange < 10000;
}

changes.subscribe(({ name, value }) => {
  if (experimentalFeatures.find(f => f.name === name) && !isReadOnlyEnv(name)) {
    lastChange = Date.now();
    setLocalStorageEnv(name, value);
  }
});
