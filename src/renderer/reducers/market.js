// @flow
import type { Currency } from "@ledgerhq/live-common/lib/types";
import { Portfolio } from "@ledgerhq/live-common/lib/types";
import { handleActions } from "redux-actions";
import { supportedCountervalues } from "~/renderer/reducers/settings";
import { setKey } from "~/renderer/storage";

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
  market_cap_change_percentage_24h: number,
  circulating_supply: number,
  total_supply: number,
  max_supply: number,
  ath: number,
  ath_date: Date,
  atl: number,
  atl_date: Date,
  sparkline_in_7d: number[],
};

export type MarketCurrencyCommonInfo = {
  id: string,
  symbol: string,
  name: string,
};

export type CurrencyType = "all" | "coins" | "tokens";
export type MarketFilters = {
  isLedgerCompatible: boolean,
  currencyType: CurrencyType,
  selectedPlatforms: string[],
};

export type CoinsListItemType = {
  id: "string",
  symbol: "string",
  name: "string"
}
export type MarketState = {
  currencies: Array<MarketCurrency>,
  coinsList: Array<CoinsListItemType>,
  filteredCurrencies: Array<MarketCurrency>,
  searchValue: string,
  range: string,
  limit: number,
  coinsListCount: undefined,
  page: number,
  counterValue: { value: string, label: string, currency: Currency },
  filters: {
    isLedgerCompatible: boolean,
    currencyType: CurrencyType,
    selectedPlatforms: string[],
  },
};

const initialState: MarketState = {
  currencies: [],
  filteredCurrencies: [],
  searchValue: "",
  range: "24h",
  order: "asc",
  orderBy: "market_cap_rank",
  counterCurrency: "usd",
  page: 1,
  limit: 9,
  coinsList: [],
  counterValue: supportedCountervalues.find(cv => cv.value === "USD"),
  filters: {
    isLedgerCompatible: false,
    currencyType: "all",
    selectedPlatforms: [],
  },
  favorites: [],
};

const handlers = {
  SET_MARKET_PARAMS: (state, { payload }) => {
    console.log(payload)
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
  GET_MARKET_CRYPTOCURRENCIES: (state, { payload }) => {
    console.log(payload);
    return {
      ...state,
    };
  },
  UPDATE_FAVORITE_CRYPTOCURRENCIES: (
    state,
    {
      payload: { cryptocurrencyId, isStarred, favorites },
    }: { payload: { cryptocurrencyId: number, status: boolean } },
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
