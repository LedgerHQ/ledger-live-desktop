// @flow

import { PlatformAppDrawers } from "~/renderer/reducers/UI";
import { Portfolio } from "@ledgerhq/live-common/lib/types";
import { handleActions } from "redux-actions";

export type MarketCurrencyType = {
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

export type MarketStateType = {
  currencies: Array<MarketCurrencyType>,
  filteredCurrencies: Array<MarketCurrencyType>,
  searchValue: string,
  range: string,
  counterValueCurrency: string
};

const initialState: MarketStateType = {
  currencies: [],
  filteredCurrencies: [],
  searchValue: "",
  range: "day",
  counterValueCurrency: ""
};

const handlers = {
  SET_MARKET_PARAMS: (state, payload) => {
    console.log('payload', payload)
    return {
      ...state,
      payload
    };
  },
};

export default handleActions(handlers, initialState);
