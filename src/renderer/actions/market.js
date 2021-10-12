// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";
import { getKey, setKey } from "~/renderer/storage";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { counterCurrencyNameTable } from "~/renderer/constants/market";

const marketClient = new MarketClient();

export const setMarketParams = (payload: MarketState) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});

export const setMarketRange = (range: string) => ({
  type: "SET_MARKET_RANGE",
  payload: range,
});

export const setMarketFilters = (filters: MarketFilters) => ({
  type: "SET_MARKET_FILTERS",
  payload: filters,
});

export const setFavoriteCryptocurrencies = (favorites: Array<{ id: number }>) => ({
  type: "SET_FAVORITE_CRYPTOCURRENCIES",
  payload: { favorites },
});

export const updateFavoriteCryptocurrencies = ({
  cryptocurrencyId,
  isStarred,
}: {
  cryptocurrencyId: number,
  isStarred: boolean,
}) =>
  async function(dispatch, getState) {
    let {
      market: { favorites, currencies },
    } = getState();

    if (isStarred) {
      favorites = favorites.filter(favorite => favorite.id !== cryptocurrencyId);
    } else {
      favorites.push({ id: cryptocurrencyId });
    }
    const currenciesWithFavorites = mergeFavoriteAndSupportedCurrencies(favorites, currencies);
    dispatch(setMarketParams({ favorites, currencies: currenciesWithFavorites }));
    await setKey("app", "favorite_cryptocurrencies", favorites);
  };

export const toggleMarketLoading = ({ loading }: { loading: boolean }) => ({
  type: "TOGGLE_MARKET_LOADING",
  payload: { loading },
});

export const getCounterCurrencies = () =>
  async function(dispatch, getState) {
    const {
      market: { counterCurrencies },
    } = getState();

    if (!counterCurrencies[0]) {
      const res = await marketClient.supportedCounterCurrencies();
      res.forEach((currency, i) => {
        res[i] = {
          key: currency,
          label: `${currency.toUpperCase()} - ${counterCurrencyNameTable[currency] || currency}`,
          value: currency,
        };
      });
      dispatch(setMarketParams({ counterCurrencies: res }));
    }
  };

export const getMarketCryptoCurrencies = (filters: {
  counterCurrency: string,
  range: string,
  limit: number,
  page: number,
  order: string,
  orderBy: string,
}) =>
  async function(dispatch, getState) {
    dispatch(
      setMarketParams({
        ...filters,
      }),
    );

    let {
      market: {
        counterCurrency,
        range,
        limit,
        page,
        coinsCount,
        order,
        orderBy,
        searchValue,
        ids,
        coins,
      },
    } = getState();

    dispatch(setMarketParams({ loading: true }));

    if (coinsCount === undefined) {
      const coins = await marketClient.supportedCurrencies();
      dispatch(setMarketParams({ coins: coins, coinsCount: coins.length }));
    }
    if (searchValue) {
      ids = [];
      coins.forEach(coin => matchesSearch(searchValue, coin) && ids.push(coin.id));
    } else {
      ids = [];
    }
    const favoriteCryptocurrencies = await getKey("app", "favorite_cryptocurrencies", []);
    if (orderBy === "isStarred") {
      if (order === "desc") {
        ids.push(favoriteCryptocurrencies.map(item => item.id));
      } else {
        if (searchValue) {
          ids = [];
          coins.forEach(coin => matchesSearch(searchValue, coin) && ids.push(coin.id));
        }
      }
    }

    limit = 9;

    const res = await marketClient.listPaginated({
      counterCurrency,
      range,
      limit,
      page,
      order,
      orderBy,
      ids,
      ...filters,
    });
    const supportedCurrenciesByLedger = listSupportedCurrencies();
    const currenciesWithFavoritesAndSupported = mergeFavoriteAndSupportedCurrencies(
      favoriteCryptocurrencies,
      res,
      supportedCurrenciesByLedger,
    );

    if (searchValue) {
      limit = res.length;
      coinsCount = ids.length;
    } else {
      limit = 9;
      coinsCount = coins.length;
    }

    dispatch(
      setMarketParams({
        currencies: currenciesWithFavoritesAndSupported,
        loading: false,
        favorites: favoriteCryptocurrencies,
        limit: limit,
        coinsCount,
        ids,
      }),
    );
  };

export function mergeFavoriteAndSupportedCurrencies(
  favorites,
  cryptocurrencies,
  supportedCurrencies,
) {
  cryptocurrencies.forEach(currency => {
    currency.isStarred = false;
    favorites.forEach(item => {
      if (item.id === currency.id) {
        currency.isStarred = true;
      }
    });
    supportedCurrencies.forEach(supportedCurrency => {
      if (currency.id === supportedCurrency.id) {
        currency.supportedCurrency = supportedCurrency;
      }
    });
  });
  return cryptocurrencies;
}

export const matchesSearch = (search?: string, currency): boolean => {
  if (!search) return true;
  const match = `${currency.symbol}|${currency.name}`;
  return match.toLowerCase().includes(search.toLowerCase());
};
