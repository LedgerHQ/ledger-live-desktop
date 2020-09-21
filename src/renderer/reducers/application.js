// @flow

import { handleActions } from "redux-actions";
import { getSystemLocale } from "~/helpers/systemLocale";
import { getLanguages } from "~/config/languages";
import { createSelector } from "reselect";
import type { OutputSelector } from "reselect";
import type { LangAndRegion } from "~/renderer/reducers/settings";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { isCurrencySwapSupported } from "@ledgerhq/live-common/lib/swap";
import type { State } from ".";
import uniq from "lodash/uniq";
import { findTokenById } from "@ledgerhq/live-common/lib/data/tokens";
import {
  findCryptoCurrencyById,
  isCurrencySupported,
} from "@ledgerhq/live-common/lib/data/cryptocurrencies";

export type ApplicationState = {
  isLocked?: boolean,
  hasPassword?: boolean,
  dismissedCarousel?: boolean,
  osDarkMode?: boolean,
  osLanguage?: LangAndRegion,
  navigationLocked?: boolean,
  swapProviders?: AvailableProvider[],
};

const { language, region } = getSystemLocale();
const languages = getLanguages();
const osLangSupported = languages.includes(language);

const state: ApplicationState = {
  osDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  osLanguage: {
    language: osLangSupported ? language : "en",
    region: osLangSupported ? region : "US",
    useSystem: true,
  },
  swapProviders: undefined,
  hasPassword: false,
  dismissedCarousel: false,
};

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
};

// NOTE: V2 `lock` and `unlock` have been moved to actions/application.js

// Selectors

export const isLocked = (state: Object) => state.application.isLocked === true;

export const hasPasswordSelector = (state: Object) => state.application.hasPassword === true;

export const hasDismissedCarouselSelector = (state: Object) =>
  state.application.dismissedCarousel === true;

export const osDarkModeSelector = (state: Object) => state.application.osDarkMode;

export const osLangAndRegionSelector = (state: Object) => state.application.osLanguage;

export const isNavigationLocked = (state: Object) => state.application.navigationLocked;

export const swapProvidersSelector = (state: Object) => state.application.swapProviders;

export const swapSupportedCurrenciesSelector: OutputSelector<
  State,
  { accountId: string },
  (TokenCurrency | CryptoCurrency)[],
> = createSelector(swapProvidersSelector, swapProviders => {
  if (!swapProviders) return [];

  const allIds = uniq(
    swapProviders.reduce((ac, { supportedCurrencies }) => [...ac, ...supportedCurrencies], []),
  );

  const tokenCurrencies = allIds
    .map(findTokenById)
    .filter(Boolean)
    .filter(t => !t.delisted);
  const cryptoCurrencies = allIds
    .map(findCryptoCurrencyById)
    .filter(Boolean)
    .filter(isCurrencySupported);

  return [...cryptoCurrencies, ...tokenCurrencies].filter(isCurrencySwapSupported);
});

// Exporting reducer

export default handleActions(handlers, state);
