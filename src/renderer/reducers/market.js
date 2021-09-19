// @flow
import { Portfolio } from "@ledgerhq/live-common/lib/types";
import { handleActions } from "redux-actions";
import type { Currency } from "@ledgerhq/live-common/lib/types";
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
  counterValueCurrency: { value: string, label: string, currency: Currency },
};

const initialState: MarketState = {
  currencies: [],
  filteredCurrencies: [],
  searchValue: "",
  range: "day",
  order: "desc",
  orderBy: "counterValue",
  counterValueCurrency: supportedCountervalues.find(cv => cv.value === "USD"),
};

const handlers = {
  SET_MARKET_PARAMS: (state, { payload }) => {
    return {
      ...state,
      ...payload,
    };
  },
};

export default handleActions(handlers, initialState);
