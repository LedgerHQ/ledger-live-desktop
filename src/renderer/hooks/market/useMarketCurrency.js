// @flow
import { useEffect, useState } from "react";
import moment from "moment";

import { MarketClient } from "~/api/market";
import { useRange } from "~/renderer/hooks/market/useRange";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import type { MarketCurrencyInfo } from "~/renderer/reducers/market";
import type { Data } from "~/renderer/components/Chart/types";
import { BigNumber } from "bignumber.js";

type Prop = {
  id: ?string,
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
  const [currency, setCurrency] = useState<MarketCurrencyInfo>({});
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
  const [chartData, setChartData] = useState<Data>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formattedHourTime = index =>
    moment()
      .startOf("hour")
      .subtract(index, "hours")
      .toDate();

  const formattedDayTime = index =>
    moment()
      .subtract(index, "days")
      .toDate();

  const formattedMinuteTime = index =>
    moment()
      .subtract(index * 5, "minutes")
      .toDate();

  const {
    rangeData: { days, interval },
  } = useRange(range);
  useEffect(() => {
    const buildChartData = ({ interval, prices }) => {
      prices = prices.reverse();

      if (!prices.length || !interval) return [];

      const data = [];
      for (let i = 0; i <= prices.length - 1; i++) {
        const price = prices[i];
        const priceMagnitude = magnitude(price);
        const formattedTime =
          interval === "hourly"
            ? formattedHourTime(i)
            : interval === "minutely"
            ? formattedMinuteTime(i)
            : formattedDayTime(i);
        data.push({ date: formattedTime, value: BigNumber(priceMagnitude) });
      }
      return data;
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
        const data = buildChartData({ interval, prices });
        setChartData(data);
        setLoading(false);
      });
  }, [id, counterCurrency, days, interval]);

  return { loading, chartData };
};
