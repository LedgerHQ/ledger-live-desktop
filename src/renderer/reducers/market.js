// @flow
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { handleActions } from "redux-actions";

import { setKey } from "~/renderer/storage";

export type MarketCurrencyInfo = {
  id: string,
  symbol: string,
  name: string,
  image: string,
  current_price: number,
  market_cap: number,
  market_cap_rank: number,
  total_volume: number,
  high_24h: number,
  low_24h: number,
  price_change_percentage_24h: number,
  price_change_percentage_in_currency: number,
  market_cap_change_percentage_24h: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number,
  ath: number,
  ath_date: Date,
  atl: number,
  atl_date: Date,
  sparkline_in_7d: number[],
  supportedCurrency: Currency,
  magnitude: number,
  isStarred: boolean,
  difference: number,
};

export type MarketCurrencyCommonInfo = {
  id: string,
  symbol: string,
  name: string,
};

export type MarketFilters = {
  isLedgerCompatible: boolean,
};

export type CoinsListItemType = {
  id: "string",
  symbol: "string",
  name: "string",
};

export type FavoriteCryptoCurrency = {
  id: string,
};

export type MarketState = {
  currencies: Array<MarketCurrencyInfo>,
  coinsList: Array<CoinsListItemType>,
  counterCurrencies: Array<any>,
  searchValue: string,
  range: string,
  limit: number,
  coinsListCount: number,
  page: number,
  ids: Array<any>,
  counterCurrency: string,
  filters: {
    isLedgerCompatible: boolean,
  },
  loading: boolean,
  favorites: Array<FavoriteCryptoCurrency>,
};

const initialState: MarketState = {
  currencies: [],
  counterCurrencies: [],
  searchValue: "",
  range: "24h",
  order: "desc",
  orderBy: "market_cap",
  counterCurrency: "usd",
  page: 1,
  limit: 9,
  coinsList: [],
  ids: [],
  filters: {
    isLedgerCompatible: false,
  },
  favorites: [],
  coinsListCount: 0,
  loading: false,
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
    return {
      ...state,
      counterCurrency: payload,
    };
  },
  SET_MARKET_FILTERS: (state, { payload }: { payload: MarketFilters }) => {
    return {
      ...state,
      filters: payload,
    };
  },
  SET_FAVORITE_CRYPTOCURRENCIES: (state, { payload }) => {
    return {
      ...state,
      favorites: payload.favorites,
    };
  },
  GET_MARKET_CRYPTOCURRENCIES: state => {
    return {
      ...state,
    };
  },
  UPDATE_FAVORITE_CRYPTOCURRENCIES: (
    state,
    {
      payload: { cryptocurrencyId, isStarred, favorites },
    }: { payload: { cryptocurrencyId: number, isStarred: boolean, favorites: { id: string }[] } },
  ) => {
    const favoritesLength = favorites.length;
    if (isStarred) {
      for (let i = 0; i < favoritesLength; i++) {
        if (favorites[i].id === cryptocurrencyId) {
          favorites.splice(i, 1);
          break;
        }
      }
    } else {
      favorites.push({ id: cryptocurrencyId });
    }

    async function updateFavorites() {
      await setKey("app", "favorite_cryptocurrencies", favorites);
    }

    updateFavorites();
    return {
      ...state,
      favorites,
    };
  },
};

export default handleActions(handlers, initialState);
