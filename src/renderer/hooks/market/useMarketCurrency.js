// @flow
import { useEffect, useState } from "react";
import moment from "moment";

import { MarketClient } from "~/api/market";
import type { MarketCurrencyByIdRequestParams } from "~/api/market";
import { useRange } from "~/renderer/hooks/market/useRange";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";

type Prop = {
  id: string,
  counterCurrency: string,
  range: string,
};

function magnitude(number) {
  // Convert to String
  const numberAsString = number.toString();
  // String Contains Decimal
  if (numberAsString.includes(".")) {
    return numberAsString.split(".")[1].length;
  }
  // String Does Not Contain Decimal
  return 0;
}

export const useMarketCurrency = ({ id, counterCurrency, range }: Prop) => {
  const [currency, setCurrency] = useState<MarketCurrencyByIdRequestParams>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const marketClient = new MarketClient();
    marketClient
      .currencyById({
        id,
        counterCurrency,
        range,
      })
      .then(currency => {
        const supportedCurrenciesByLedger = listSupportedCurrencies();
        supportedCurrenciesByLedger.forEach(supportedCurrency => {
          if (currency.id === supportedCurrency.id) {
            currency.supportedCurrency = supportedCurrency;
          }
        });
        currency.magnitude = magnitude(currency.current_price);
        setCurrency(currency);
        setLoading(false);
      });
  }, [id, counterCurrency, range]);
  return { loading, currency };
};

export const useMarketCurrencyChart = ({ id, counterCurrency, range }: Prop) => {
  const [chartData, setChartData] = useState<Array>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const buildHourlyData = prices => {
    const chartData = [];
    const hoursPerDay = 24;
    for (let i = 0; i < hoursPerDay + 1; i++) {
      const price = prices[i];
      const priceMagnitude = magnitude(price);
      const formattedTime = moment()
        .startOf("hour")
        .subtract(i, "hours")
        .toDate();
      chartData.unshift({ date: formattedTime, value: price.toFixed(priceMagnitude) });
    }
    return chartData;
  };

  const buildDailyData = prices => {
    const chartData = [];
    const days = prices.length;
    for (let i = 0; i < days + 1; i++) {
      const price = prices[i];
      const priceMagnitude = magnitude(price);
      const formattedTime = moment()
        .subtract(i, "days")
        .toDate();
      chartData.push({ date: formattedTime, value: price.toFixed(priceMagnitude) });
    }
    return chartData;
  };

  const {
    rangeData: { days, interval },
  } = useRange(range);
  useEffect(() => {
    const buildChartData = ({ interval, prices }) => {
      prices = prices.reverse();
      switch (interval) {
        case "hourly":
          return buildHourlyData(prices);
        case "daily":
          return buildDailyData(prices);
        default:
          return [];
      }
    };
    const marketClient = new MarketClient();
    marketClient
      .currencyChartData({
        id,
        counterCurrency,
        days,
        interval,
      })
      .then(prices => {
        const chartData = buildChartData({ interval, prices });
        setChartData(chartData);
        setLoading(false);
      });
  }, [id, counterCurrency, days, interval]);

  return { loading, chartData };
};
