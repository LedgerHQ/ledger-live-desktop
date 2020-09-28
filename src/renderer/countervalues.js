// @flow

import type { OutputSelector } from "reselect";
import { createSelector } from "reselect";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { currenciesSelector } from "~/renderer/reducers/accounts";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

export const trackingPairsSelector: OutputSelector<
  any,
  {},
  Currency[],
> = createSelector(
  currenciesSelector,
  counterValueCurrencySelector,
  (currencies, counterValueCurrency) =>
    currencies.map(c => ({ from: c, to: counterValueCurrency })),
);
