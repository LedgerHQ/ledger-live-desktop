// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";
import type { Account, SubAccount } from "@ledgerhq/live-common/lib/types";
import { getKey, setKey } from "~/renderer/storage";

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

export const setFavoriteCryptocurrencies = (favorites: Array<{ id: number }>) => ({
  type: "SET_FAVORITE_CRYPTOCURRENCIES",
  payload: { favorites },
});

export const updateFavoriteCryptocurrencies = ({
  cryptocurrencyId,
  isStarred,
  favorites,
}: {
  cryptocurrencyId: number,
  isStarred: boolean,
}) => ({
  type: "UPDATE_FAVORITE_CRYPTOCURRENCIES",
  payload: { cryptocurrencyId, isStarred, favorites },
});
