// @flow

import { MarketClient } from "~/api/market";
import { useEffect, useState } from "react";
import type { MarketCurrencyByIdRequestParams } from "~/api/market";
import { useRange } from "~/renderer/hooks/market/useRange";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import moment from "moment";

type Prop = {
  id: string,
  counterCurrency: string,
  range: string,
};

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
        setCurrency(currency);
        setLoading(false);
      });
  }, [id, counterCurrency, range]);
  // currency.difference = data[data.length - 1] - data[0] || 0;
  return { loading, currency };
};

export const useMarketCurrencyChart = ({ id, counterCurrency, range }: Prop) => {
  const [chartData, setChartData] = useState<Array>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const buildHourlyData = prices => {
    const time = [];
    const hoursPerDay = 24;
    for (let i = 0; i < hoursPerDay + 1; i++) {
      const formattedTime = moment()
        .startOf("hour")
        .subtract(i, "hours")
        .toDate();
      time.unshift({ date: formattedTime, value: prices[i] * 100 });
    }
    return time;
  };

  const buildDailyData = prices => {
    const time = [];
    const days = prices.length;
    for (let i = 0; i < days + 1; i++) {
      const formattedTime = moment()
        .subtract(i, "days")
        .toDate();
      time.push({ date: formattedTime, value: prices[i] * 100 });
    }
    return time;
  };

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

  const {
    rangeData: { days, interval },
  } = useRange(range);
  useEffect(() => {
    const marketClient = new MarketClient();
    marketClient
      .currencyChartData({
        id,
        counterCurrency,
        days,
        interval,
      })
      .then(prices => {
        prices = buildChartData({ interval, prices });
        setChartData(prices);
        setLoading(false);
      });
  }, [id, counterCurrency, days, interval]);

  return { loading, chartData };
};