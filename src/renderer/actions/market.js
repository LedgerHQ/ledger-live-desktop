// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";
import { getKey, setKey } from "~/renderer/storage";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { counterCurrencyNameTable } from "~/renderer/constants/market";

const DEFAULT_PAGE_LIMIT = 9;
const marketClient = new MarketClient();

export const setMarketParams = (payload: Partial<MarketState>) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});

export const setMarketRange = (range: string) => ({
  type: "SET_MARKET_RANGE",
  payload: range,
});

export const setMarketFilters = (filters: Partial<MarketFilters>) => ({
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

    await setKey("app", "favorite_cryptocurrencies", favorites);
    const currenciesWithFavorites = mergeFavoriteAndSupportedCurrencies(favorites, currencies);
    dispatch(setMarketParams({ favorites, currencies: currenciesWithFavorites }));
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

export const getMarketCryptoCurrencies = (
  filterParams: Partial<{
    counterCurrency: string,
    range: string,
    limit: number,
    page: number,
    order: string,
    orderBy: string,
  }>,
) =>
  async function(dispatch, getState) {
    dispatch(
      setMarketParams({
        ...filterParams,
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
        filters,
        currencies,
      },
    } = getState();

    if (filters.orderBy) {
      orderBy = filters.orderBy;
    }

    if (filters.order) {
      order = filters.order;
    }

    dispatch(setMarketParams({ loading: true }));

    if (coinsCount === undefined) {
      coins = await marketClient.supportedCurrencies();
      dispatch(setMarketParams({ coins: coins, coinsCount: coins.length }));
    }

    const favoriteCryptocurrencies = await getKey("app", "favorite_cryptocurrencies", []);

    const supportedCurrenciesByLedger = listSupportedCurrencies();
    ids = [];
    if (searchValue || filters.isLedgerCompatible) {
      let filteredCoins = coins;

      if (filters.isLedgerCompatible) {
        const supportedCurrencyIdsByLedger = supportedCurrenciesByLedger.map(
          currency => currency.id,
        );
        filteredCoins = filteredCoins.filter(coin =>
          supportedCurrencyIdsByLedger.includes(coin.id),
        );
      }

      if (searchValue) {
        filteredCoins.forEach(coin => matchesSearch(searchValue, coin) && ids.push(coin.id));
      } else {
        ids = filteredCoins.map(coin => coin.id);
      }
    }
    let showFavorites = false;
    if (orderBy === "isStarred") {
      if (order === "desc") {
        showFavorites = true;
        favoriteCryptocurrencies.forEach(fav => {
          ids.unshift(fav.id);
        });
      } else {
        ids = ids.filter(id => favoriteCryptocurrencies.indexOf(id) < 0);
        limit = DEFAULT_PAGE_LIMIT;
      }
    }

    let res;
    if ((showFavorites || searchValue) && !ids.length) {
      res = [];
    } else {
      res = await marketClient.listPaginated({
        counterCurrency,
        range,
        limit,
        page,
        order,
        orderBy,
        ids,
      });
    }
    currencies = mergeFavoriteAndSupportedCurrencies(
      favoriteCryptocurrencies,
      res,
      supportedCurrenciesByLedger,
    );

    if (!currencies.length) {
      coinsCount = 0;
    } else if (ids.length) {
      limit = page === 1 ? res.length : limit;
      coinsCount = ids.length;
    } else {
      limit = DEFAULT_PAGE_LIMIT;
      coinsCount = coins.length;
    }

    dispatch(
      setMarketParams({
        currencies: currencies,
        loading: false,
        favorites: favoriteCryptocurrencies,
        limit,
        ids,
        coinsCount,
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
    favorites &&
      favorites.forEach(item => {
        if (item.id === currency.id) {
          currency.isStarred = true;
        }
      });
    supportedCurrencies &&
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
