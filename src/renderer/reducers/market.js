// @flow
import { Portfolio } from "@ledgerhq/live-common/lib/types";
import { handleActions } from "redux-actions";
import type { Account, Currency } from "@ledgerhq/live-common/lib/types";
import { supportedCountervalues } from "~/renderer/reducers/settings";

export type MarketCurrency = {
  coinType: number,
  color: string,
  explorerViews: Array<any>,
  family: string,
  id: string,
  managerAppName: string,
  name: string,
  portfolio: Portfolio,
  scheme: string,
  ticker: string,
  type: string,
  units: Array<any>,
};

export type MarketState = {
  currencies: Array<MarketCurrency>,
  filteredCurrencies: Array<MarketCurrency>,
  searchValue: string,
  range: string,
  counterValue: { value: string, label: string, currency: Currency },
};

const initialState: MarketState = {
  currencies: [],
  filteredCurrencies: [],
  searchValue: "",
  range: "day",
  order: "desc",
  orderBy: "counterValue",
  counterValue: supportedCountervalues.find(cv => cv.value === "USD"),
};

const handlers = {
  SET_MARKET_PARAMS: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  },
  SET_MARKET_RANGE: (state, { payload }: { payload: string }) => {
    return {
      ...state,
      range: payload,
    };
  },
  SET_MARKET_COUNTERVALUE: (state, { payload }: { payload: string }) => {
    const counterValue = supportedCountervalues.find(cv => cv.value === payload);
    return {
      ...state,
      counterValue,
    };
  },
};

export default handleActions(handlers, initialState);
