// @flow
import { APIClient } from "~/api/index";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import { MarketCurrencyCommonInfo } from "~/renderer/reducers/market";

type MarketListRequestParams = {
  counterCurrency: string,
  ids: string[],
  page: number,
  limit: number,
  range: string,
  orderBy: string,
  order: string,
};

type MarketCurrencyBuIdRequestParams = {
  id: string,
  counterCurrency: string,
  range: string,
};

type MarketCurrencyChartDataRequestParams = {
  id: string,
  counterCurrency: string,
  days: number,
  interval: string,
};

export class MarketClient extends APIClient {
  ROOT_PATH: string = "https://api.coingecko.com/api/v3";

  // fetches currencies data for selected currencies ids
  // ids can be empty for fetching all currencies
  async listPaginated({
    counterCurrency,
    range,
    limit = 10,
    page = 1,
    ids = [],
    orderBy = "market_cap",
    order = "desc",
  }: MarketListRequestParams): Promise<MarketCurrencyInfo[]> {
    let path = `${this.ROOT_PATH}/coins/markets?vs_currency=${counterCurrency}&order=${orderBy}_${order}&per_page=${limit}&page=${page}&sparkline=true&price_change_percentage=${range}`;

    if (ids.length) {
      path += `&ids=${ids}`;
    }
    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    const currenciesJson = await response.json();

    return currenciesJson.map(currency => ({
      id: currency.id,
      symbol: currency.symbol,
      name: currency.name,
      image: currency.image,
      current_price: currency.current_price,
      market_cap: currency.market_cap,
      market_cap_rank: currency.market_cap_rank,
      total_volume: currency.total_volume,
      high_24h: currency.high_24h,
      low_24h: currency.low_24h,
      price_change_percentage_in_currency: currency[`price_change_percentage_${range}`],
      market_cap_change_percentage_24h: currency.market_cap_change_percentage_24h,
      circulating_supply: currency.circulating_supply,
      total_supply: currency.total_supply,
      max_supply: currency.max_supply,
      ath: currency.ath,
      ath_date: currency.ath_date,
      atl: currency.atl,
      atl_date: currency.atl_date,
      sparkline_in_7d: currency.sparkline_in_7d.price,
    }));
  }

  // Fetches list of supported counterCurrencies
  async supportedCounterCurrencies(): Promise<string[]> {
    const path = `${this.ROOT_PATH}/simple/supported_vs_currencies`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  // Fetches list of supported currencies
  // Hard to perform
  async supportedCurrencies(): Promise<MarketCurrencyCommonInfo[]> {
    const path = `${this.ROOT_PATH}/coins/list?include_platform=false`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  // Fetches list of supported currencies
  // Hard to perform
  async currencyChartData({
    id,
    counterCurrency,
    days,
    interval,
  }: MarketCurrencyChartDataRequestParams): Promise<number[]> {
    const path = `${this.ROOT_PATH}/coins/${id}/market_chart?vs_currency=${counterCurrency}&days=${days}&interval=${interval}`;

    const response = await this.http.get(path);

    if (!response.ok) {
      await this.handleError(response);
    }

    const marketChartJson = await response.json().prices;

    return marketChartJson.map(chartData => chartData[1]);
  }

  // Fetches info for single currency
  async currencyById({
    id,
    counterCurrency,
    range,
  }: MarketCurrencyBuIdRequestParams): Promise<MarketCurrencyCommonInfo[]> {
    const currenciesInfos = await this.listPaginated({
      ids: [id],
      limit: 1,
      page: 1,
      counterCurrency,
      range,
    });

    return currenciesInfos[0];
  }
}
