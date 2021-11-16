// @flow
import * as React from "react";
import {
  RELOAD,
  SET_MARKET_FILTERS,
  SET_MARKET_PARAMS,
  SET_MARKET_RANGE,
} from "~/renderer/contexts/actionTypes";
import type {
  CoinsListItemType,
  FavoriteCryptoCurrency,
  MarketCurrencyInfo,
  MarketFilters,
} from "~/renderer/reducers/market";
import type { GetMarketCryptoCurrencies } from "~/renderer/actions/market";
import { MARKET_DEFAULT_PAGE_LIMIT } from "~/renderer/actions/market";
import { useDispatch } from "react-redux";
import handlers from "~/renderer/contexts/handlers";
import type { Dispatch } from "redux";

export const MarketContext: React$Context<any> = React.createContext<any>();

type MarketState = {
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
  filters: MarketFilters,
  loading: boolean,
  favorites: Array<FavoriteCryptoCurrency>,
  failedMarketParams: GetMarketCryptoCurrencies,
  reload: number,
  error: boolean,
};

export type ContextAction = {
  type: string,
  payload: $Shape<any>,
};

function marketReducer(state: MarketState, action: ContextAction) {
  switch (action.type) {
    case SET_MARKET_PARAMS: {
      return { ...state, ...action.payload };
    }
    case SET_MARKET_RANGE: {
      return {
        ...state,
        range: action.payload,
      };
    }
    case SET_MARKET_FILTERS: {
      console.log(action);
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    }
    case RELOAD: {
      return { ...state, reload: state.reload + 1 };
    }
    default: {
      return state;
    }
  }
}

const initialState: MarketState = {
  currencies: [],
  counterCurrencies: [],
  searchValue: "",
  range: "24h",
  order: "desc",
  orderBy: "market_cap",
  counterCurrency: "usd",
  page: 1,
  limit: MARKET_DEFAULT_PAGE_LIMIT,
  coins: [],
  ids: [],
  filters: {
    isLedgerCompatible: false,
    isFavorite: false,
  },
  favorites: [],
  coinsCount: 0,
  loading: false,
  failedMarketParams: {},
  reload: 0,
  error: false,
};

export function MarketProvider({ children }: { children: React.Node }) {
  const [state, setState] = React.useReducer(marketReducer, initialState);
  const reduxDispatch: Dispatch<any> = useDispatch();

  const dispatch = async (type: string, payload = {}): Promise<any> => {
    if (handlers[type]) {
      await handlers[type]({ dispatch, state, action: { type, payload }, reduxDispatch });
    } else {
      setState({ type, payload });
    }
  };
  const value: { contextState: MarketState, contextDispatch: typeof dispatch } = {
    contextState: state,
    contextDispatch: dispatch,
  };
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
