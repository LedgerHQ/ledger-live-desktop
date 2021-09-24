// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";

export const setMarketParams = (payload: MarketState) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});

export const setMarketRange = (range: string) => ({
  type: "SET_MARKET_RANGE",
  payload: range,
});

export const setMarketCounterValue = (counterValue: string) => ({
  type: "SET_MARKET_COUNTERVALUE",
  payload: counterValue,
});

export const setMarketFilters = (filters: MarketFilters) => ({
  type: "SET_MARKET_FILTERS",
  payload: filters,
});
