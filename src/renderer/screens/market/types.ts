// @flow
import { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

export type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
};

export type SupportedCoins = MarketCoin[];

export type MarketListRequestParams = {
  counterCurrency?: string;
  ids?: string[];
  starred?: string[];
  page?: number;
  limit?: number;
  range?: string;
  orderBy?: string;
  order?: string;
  search?: string;
  lastRequestTime?: Date;
  sparkline?: boolean;
  liveCompatible?: boolean;
};

export type MarketCurrencyChartDataRequestParams = {
  id?: string;
  counterCurrency?: string;
  range?: string;
  lastRequestTime?: Date;
};

export type SparklineSvgData = {
  path: string;
  viewBox: string;
};

export type CurrencyData = {
  id: string;
  name: string;
  image?: string;
  internalCurrency?: CryptoCurrency;
  marketcap?: number;
  marketcapRank: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
  ticker: string;
  price: number;
  priceChangePercentage: number;
  marketCapChangePercentage24h: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: number;
  ath: number;
  athDate: Date;
  atl: number;
  atlDate: Date;
  sparklineIn7d: SparklineSvgData;
  chartData: Record<string, number[]>;
};

export type State = {
  ready: boolean;
  marketData?: CurrencyData[];
  selectedCurrency?: string;
  requestParams: MarketListRequestParams;
  page: number;
  chartRequestParams: MarketCurrencyChartDataRequestParams;
  loading: boolean;
  loadingChart: boolean;
  endOfList: boolean;
  error?: Error;
  totalCoinsAvailable: number;
  supportedCounterCurrencies: string[];
  selectedCoinData?: CurrencyData;
  counterCurrency?: string;
};

export type MarketDataApi = {
  setSupportedCoinsList: () => Promise<SupportedCoins>;
  listPaginated: (params: MarketListRequestParams) => Promise<CurrencyData[]>;
  supportedCounterCurrencies: () => Promise<string[]>;
  currencyChartData: (
    params: MarketCurrencyChartDataRequestParams,
  ) => Promise<{ [range: string]: number[] }>;
};
