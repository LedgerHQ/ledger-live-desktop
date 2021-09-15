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

export type MarketState = {
  currencies: Array<MarketCurrencyType>,
  filteredCurrencies: Array<MarketCurrencyType>,
  searchValue: string,
};

const initialState: MarketState = {
  currencies: [],
  filteredCurrencies: [],
  searchValue: "",
};

const handlers = {
  MARKET_BUILD_CURRENCIES_LIST: (state, { payload }: { payload: OpenPayload }) => {
    const { tabId } = payload;

    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        isOpen: true,
        tabId: tabId || "announcement",
      },
    };
  },
};

export default handleActions(handlers, initialState);
