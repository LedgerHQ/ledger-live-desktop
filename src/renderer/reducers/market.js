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
  supportedCurrency?: Currency,
  magnitude: number,
  isStarred?: boolean,
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
  id: string,
  symbol: string,
  name: string,
};

export type FavoriteCryptoCurrency = {
  id: string,
};

export type MarketState = {
  currencies: Array<MarketCurrencyInfo>,
  coins: Array<CoinsListItemType>,
  counterCurrencies: Array<any>,
  coinsCount: number,
  searchValue: string,
  range: string,
  limit: number,
  page: number,
  ids: Array<string>,
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
  coins: [],
  ids: [],
  filters: {
    isLedgerCompatible: false,
  },
  favorites: [],
  coinsCount: 0,
  loading: false,
};

const handlers = {
  SET_MARKET_PARAMS: (state: any, { payload }: { payload: any }) => {
    return {
      ...state,
      ...payload,
    };
  },
  SET_MARKET_RANGE: (state: any, { payload }: { payload: string }) => {
    return {
      ...state,
      range: payload,
    };
  },
  SET_MARKET_FILTERS: (state: any, { payload }: { payload: MarketFilters }) => {
    return {
      ...state,
      filters: payload,
    };
  },
  GET_MARKET_CRYPTOCURRENCIES: (state: any) => {
    return {
      ...state,
    };
  },
  UPDATE_FAVORITE_CRYPTOCURRENCIES: (
    state: any,
    {
      payload: { cryptocurrencyId, isStarred, favorites },
    }: {
      payload: {
        cryptocurrencyId: string,
        isStarred: boolean,
        favorites: Array<FavoriteCryptoCurrency>,
      },
    },
  ) => {
    // TODO: Move this to action

    const favoritesLength: number = favorites.length;
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
