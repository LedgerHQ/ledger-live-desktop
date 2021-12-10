// @flow
import React, {
  createContext,
  useMemo,
  useCallback,
  useContext,
  ReactElement,
  useReducer,
  useEffect,
  useState,
} from "react";

import { useDebounce } from "@ledgerhq/live-common/lib//hooks/useDebounce";
import { Currency } from "@ledgerhq/live-common/lib/types";
import {
  State,
  MarketDataApi,
  MarketListRequestParams,
  MarketCurrencyChartDataRequestParams,
} from "./types";
import defaultFetchApi from "./api";

type Props = {
  children: React.ReactNode;
  fetchApi?: MarketDataApi;
  countervalue?: Currency;
};
type API = {
  counterCurrency: string;
  refresh: (param?: MarketListRequestParams) => void;
  refreshChart: (param?: MarketCurrencyChartDataRequestParams) => void;
  selectCurrency: (string) => void;
  loadNextPage: () => Promise<boolean>;
};

export type MarketDataContextType = State & API;

const initialState: State = {
  ready: false,
  marketData: [],
  selectedCurrency: null,
  requestParams: {
    range: "24h",
    limit: 50,
    ids: [],
    starred: [],
    orderBy: "market_cap",
    order: "desc",
    search: "",
    liveCompatible: false,
  },
  page: 1,
  chartRequestParams: {
    range: "24h",
  },
  loading: false,
  loadingChart: false,
  endOfList: false,
  error: null,
  totalCoinsAvailable: 0,
  selectedCoinData: null,
};

const MarketDataContext = createContext<MarketDataContextType>({
  ...initialState,
  counterCurrency: undefined,
  refresh: () => {
    return null;
  },
  refreshChart: () => {
    return null;
  },
  selectCurrency: () => {
    return null;
  },
  loadNextPage: () => Promise.reject(new Error()),
});

const ACTIONS = {
  IS_READY: "IS_READY",

  UPDATE_MARKET_DATA: "UPDATE_MARKET_DATA",
  UPDATE_SINGLE_MARKET_DATA: "UPDATE_SINGLE_MARKET_DATA",
  UPDATE_SINGLE_CHART_DATA: "UPDATE_SINGLE_CHART_DATA",

  REFRESH_MARKET_DATA: "REFRESH_MARKET_DATA",
  REFRESH_CHART_DATA: "REFRESH_CHART_DATA",

  SET_LOADING: "SET_LOADING",
  SET_LOADING_CHART: "SET_LOADING_CHART",
  SET_ERROR: "SET_ERROR",

  SELECT_CURRENCY: "SELECT_CURRENCY",
  UPDATE_COUNTERVALUE: "UPDATE_COUNTERVALUE",
};

function marketDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.IS_READY:
      return { ...state, isReady: true, totalCoinsAvailable: action.payload };
    case ACTIONS.UPDATE_MARKET_DATA: {
      const newData = action.payload.marketData;
      const page = action.payload.page || state.requestParams.page;
      const marketData = [...state.marketData.map(data => ({ ...data }))];
      if (!newData.length || marketData.some(({ id }) => id === newData[0].id))
        return { ...state, loading: false };

      return {
        ...state,
        marketData: marketData.concat(newData),
        endOfList: newData.length < state.requestParams.limit,
        loading: false,
        page,
      };
    }
    case ACTIONS.UPDATE_SINGLE_MARKET_DATA: {
      const marketData = [...state.marketData.map(data => ({ ...data }))];
      const index = marketData.findIndex(({ id }) => id === action.payload.id);
      if (index >= 0) {
        marketData[index] = { ...marketData[index], ...action.payload };
      }
      return { ...state, marketData, loading: false };
    }
    case ACTIONS.UPDATE_SINGLE_CHART_DATA: {
      const marketData = [...state.marketData.map(data => ({ ...data }))];
      const index = marketData.findIndex(({ id }) => id === action.payload.id);
      if (index >= 0) {
        marketData[index].chartData = {
          ...marketData[index].chartData,
          ...action.payload.chartData,
        };
      }
      return { ...state, marketData, loading: false };
    }

    case ACTIONS.REFRESH_MARKET_DATA: {
      const requestParams = {
        ...state.requestParams,
        ...action.payload,
        lastRequestTime: Date.now(),
      };
      return { ...state, marketData: [], requestParams, loading: true, page: 1 };
    }
    case ACTIONS.REFRESH_CHART_DATA: {
      const chartRequestParams = {
        ...state.chartRequestParams,
        ...action.payload,
        loadingChart: true,
        lastRequestTime: Date.now(),
      };
      return { ...state, chartRequestParams };
    }

    case ACTIONS.UPDATE_COUNTERVALUE: {
      const requestParams = {
        ...state.requestParams,
        lastRequestTime: Date.now(),
        page: 1,
        counterCurrency: action.payload,
      };
      const chartRequestParams = {
        ...state.chartRequestParams,
        lastRequestTime: Date.now(),
        counterCurrency: action.payload,
      };
      return { ...state, marketData: [], requestParams, chartRequestParams, loading: true };
    }

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_LOADING_CHART:
      return { ...state, loadingChart: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SELECT_CURRENCY:
      return { ...state, selectedCurrency: action.payload, loading: !!action.payload };
    default:
      return state;
  }
}

export const MarketDataProvider = ({ children, fetchApi, countervalue }: Props): ReactElement => {
  const [state, dispatch] = useReducer(marketDataReducer, initialState);
  const api = fetchApi || defaultFetchApi;
  const {
    marketData,
    requestParams,
    chartRequestParams,
    loading,
    loadingChart,
    page,
  } = useDebounce(state, 300);
  const counterCurrency = useMemo(() => countervalue?.ticker, [countervalue]);

  const handleError = useCallback(payload => {
    dispatch({ type: ACTIONS.SET_ERROR, payload });
  }, []);

  useEffect(() => {
    api.setSupportedCoinsList().then(
      coins =>
        dispatch({
          type: ACTIONS.IS_READY,
          payload: coins.length,
        }),
      handleError,
    );
  }, [api, handleError]);

  useEffect(() => {
    if (chartRequestParams?.id && chartRequestParams?.counterCurrency && !loadingChart) {
      const currentMarketData = marketData.find(({ id }) => id === chartRequestParams.id);
      const range = chartRequestParams.range;

      if (currentMarketData && !currentMarketData?.chartData?.[range]) {
        api.currencyChartData(chartRequestParams).then(
          chartData =>
            dispatch({
              type: ACTIONS.UPDATE_SINGLE_CHART_DATA,
              payload: { id: chartRequestParams.id, chartData },
            }),
          handleError,
        );
      } else
        dispatch({
          type: ACTIONS.SET_LOADING_CHART,
          payload: false,
        });
    }
  }, [chartRequestParams, marketData, loadingChart, api, handleError]);

  useEffect(() => {
    if (chartRequestParams?.id && chartRequestParams?.counterCurrency && !loading) {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      api
        .listPaginated({
          ...chartRequestParams,
          search: "",
          starred: [],
          liveCompatible: false,
          ids: [chartRequestParams.id],
          limit: 1,
          page: 1,
        })
        .then(
          ([{ chartData, ...marketData }]) =>
            dispatch({ type: ACTIONS.UPDATE_SINGLE_MARKET_DATA, payload: marketData }),
          handleError,
        );
    }
  }, [api, chartRequestParams, handleError, loading]);

  useEffect(() => {
    if (requestParams?.counterCurrency) {
      api
        .listPaginated(requestParams)
        .then(
          marketData => dispatch({ type: ACTIONS.UPDATE_MARKET_DATA, payload: { marketData } }),
          handleError,
        );
    }
  }, [api, handleError, requestParams]);

  const refresh = useCallback((payload = {}) => {
    dispatch({ type: ACTIONS.REFRESH_MARKET_DATA, payload });
  }, []);

  const refreshChart = useCallback((payload = {}) => {
    dispatch({ type: ACTIONS.REFRESH_CHART_DATA, payload });
  }, []);

  const selectCurrency = useCallback(id => {
    dispatch({
      type: ACTIONS.REFRESH_CHART_DATA,
      payload: {
        id,
      },
    });
  }, []);

  const loadNextPage = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (loading) {
        reject(new Error());
      } else {
        const newPage = page + 1;
        api.listPaginated({ ...requestParams, page: newPage }).then(
          marketData => {
            dispatch({ type: ACTIONS.UPDATE_MARKET_DATA, payload: { marketData, page: newPage } });
            resolve(true);
          },
          err => {
            handleError(err);
            reject(new Error(err));
          },
        );
      }
    });
  }, [loading, page, api, requestParams, handleError]);

  useEffect(() => {
    dispatch({ type: ACTIONS.UPDATE_COUNTERVALUE, payload: counterCurrency });
  }, [counterCurrency]);

  const value = {
    ...state,
    counterCurrency,
    refresh,
    refreshChart,
    selectCurrency,
    loadNextPage,
  };

  return <MarketDataContext.Provider value={value}>{children}</MarketDataContext.Provider>;
};

export function useMarketData(): MarketDataContextType {
  return useContext(MarketDataContext);
}

export function useSingleCoinMarketData(currencyId): MarketDataContextType {
  const {
    marketData,
    selectedCurrency,
    chartRequestParams,
    loading,
    loadingChart,
    error,
    counterCurrency,
    refreshChart,
    selectCurrency,
  } = useContext(MarketDataContext);

  const [state, setState] = useState({
    selectedCoinData: null,
    selectedCurrency,
    chartRequestParams,
    loading,
    loadingChart,
    error,
    counterCurrency,
    refreshChart,
    selectCurrency,
  });

  useEffect(() => {
    setState(s => ({
      ...s,
      selectedCoinData: marketData.find(({ id }) => id === currencyId) || s.selectedCoinData,
      selectedCurrency,
      chartRequestParams,
      loading,
      loadingChart,
      error,
      counterCurrency,
    }));
  }, [
    marketData,
    currencyId,
    selectedCurrency,
    chartRequestParams,
    loading,
    loadingChart,
    error,
    counterCurrency,
  ]);

  // @ts-expect-error error
  return state;
}
