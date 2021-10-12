// @flow
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Currency } from "@ledgerhq/live-common/lib/types";

import { getKey } from "~/renderer/storage";
import { setFavoriteCryptocurrencies } from "~/renderer/actions/market";
import type { MarketFilters } from "~/renderer/reducers/market";
import type { RangeData } from "~/renderer/hooks/market/useRange";

type MarketCurrenciesProps = {
  rangeData: RangeData,
  counterValueCurrency: Currency,
  filters: MarketFilters,
};

export function useMarketCurrencies({
  favorites,
}: MarketCurrenciesProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    async function getFavorites() {
      const res = await getKey("app", "favorite_cryptocurrencies", []);
      dispatch(setFavoriteCryptocurrencies(res));
    }
    if (!favorites.length) {
      return getFavorites();
    }
  }, [dispatch, favorites.length]);

  // TODO: use new api client here to get infos

  // const currencies = listSupportedCurrencies();
  //
  // const inputData = [];
  // let t = Date.now() - count * increment;
  //
  // for (let i = 0; i < count; i++) {
  //   const date = new Date(t);
  //   inputData.push({ date, value: 0 });
  //   t += increment;
  // }
  //
  // return currencies.map(currency => {
  //   const valueNum = 10 ** currency.units[0].magnitude;
  //   const value = valueNum instanceof BigNumber ? valueNum.toNumber() : valueNum;
  //   const currencyInputData = inputData.map(dataPoint => {
  //     dataPoint.value = value;
  //
  //     return dataPoint;
  //   });
  //
  //   const data =
  //     // TODO: remove hook from loop
  //     // eslint-disable-next-line react-hooks/rules-of-hooks
  //     useCalculateMany(currencyInputData, {
  //       from: currency,
  //       to: counterValueCurrency,
  //       disableRounding: false,
  //     }) || [];
  //
  //   currency.variation = inputData.map(({ date }, i) => ({
  //     date,
  //     value: data[i] || 0,
  //   }));
  //   currency.price = data[data.length - 1] || 0;
  //   currency.difference = data[data.length - 1] - data[0] || 0;
  //   currency.change = (currency.difference / data[0]) * PERCENT_MULTIPLIER || 0;
  //   currency.isStarred = false;
  //   favorites.forEach(item => {
  //     if (item.id === currency.id) {
  //       currency.isStarred = true;
  //     }
  //   });
  //
  //   return currency;
  // });
}
