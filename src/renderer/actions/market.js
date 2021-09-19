// @flow
import { MarketState } from "~/renderer/reducers/market";

export const setMarketParams = (payload: MarketState) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});
