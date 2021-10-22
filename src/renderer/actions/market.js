// @flow
import type {
  FavoriteCryptoCurrency,
  MarketFilters,
  MarketState,
  MarketCurrencyInfo,
} from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";
import { getKey, setKey } from "~/renderer/storage";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { counterCurrencyNameTable } from "~/renderer/constants/market";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import type { ThunkAction } from "redux-thunk";

const DEFAULT_PAGE_LIMIT = 9;
const marketClient = new MarketClient();

export const setMarketParams = (payload: $Shape<MarketState>) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});

export const setMarketRange = (range: string) => ({
  type: "SET_MARKET_RANGE",
  payload: range,
});

export const setMarketFilters = (filters: $Shape<MarketFilters>) => ({
  type: "SET_MARKET_FILTERS",
  payload: filters,
});

export const updateFavoriteCryptocurrencies: ThunkAction = ({
  cryptocurrencyId,
  isStarred,
}: {
  cryptocurrencyId: string,
  isStarred: boolean,
}) =>
  async function(dispatch, getState) {
    let {
      market: { favorites, currencies: cryptocurrencies },
    } = getState();

    if (isStarred) {
      favorites = favorites.filter(favorite => favorite.id !== cryptocurrencyId);
    } else {
      favorites.push({ id: cryptocurrencyId });
    }

    await setKey("app", "favorite_cryptocurrencies", favorites);
    const currenciesWithFavorites = mergeFavoriteAndSupportedCurrencies(
      favorites,
      cryptocurrencies,
    );
    dispatch(setMarketParams({ favorites, currencies: currenciesWithFavorites }));
  };

export const toggleMarketLoading = ({ loading }: { loading: boolean }) => ({
  type: "TOGGLE_MARKET_LOADING",
  payload: { loading },
});

export const getCounterCurrencies: ThunkAction = () =>
  async function(dispatch, getState) {
    const {
      market: { counterCurrencies },
    } = getState();

    if (!counterCurrencies[0]) {
      const supportedCounterCurrencies: string[] = await marketClient.supportedCounterCurrencies();
      let res: {
        key: string,
        label: string,
        value: string,
      }[];
      supportedCounterCurrencies.forEach((currency, i) => {
        res.push({
          key: currency,
          label: `${currency.toUpperCase()} - ${counterCurrencyNameTable[currency] || currency}`,
          value: currency,
        });
      });
      dispatch(setMarketParams({ counterCurrencies: res }));
    }
  };

export const getMarketCryptoCurrencies: ThunkAction = (
  filterParams: $Shape<{
    counterCurrency: string,
    range: string,
    limit: number,
    page: number,
    order: string,
    orderBy: string,
  }> = {},
) =>
  async function(dispatch, getState) {
    filterParams = { ...getState().market, ...filterParams };
    dispatch(
      setMarketParams({
        ...filterParams,
        loading: true,
      }),
    );

    let {
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
    } = filterParams;

    const showFavorites: boolean = filters.isFavorite;
    const unShowFavorites: boolean = !filters.isFavorite;

    if (!coinsCount) {
      coins = await marketClient.supportedCurrencies();
    }

    const favoriteCryptocurrencies: Array<FavoriteCryptoCurrency> = await getKey(
      "app",
      "favorite_cryptocurrencies",
      [],
    );

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
        filteredCoins.forEach(
          coin =>
            matchesSearch(searchValue, { name: coin.name, symbol: coin.symbol }) &&
            ids.push(coin.id),
        );
      } else {
        ids = filteredCoins.map(coin => coin.id);
      }
    }

    showFavorites &&
      favoriteCryptocurrencies.forEach(fav => {
        ids.unshift(fav.id);
      });

    if (unShowFavorites) {
      ids = ids.filter(id => favoriteCryptocurrencies.indexOf(id) < 0);
      limit = DEFAULT_PAGE_LIMIT;
    }

    let cryptocurrencies = [];
    if ((showFavorites || searchValue) && !ids.length) {
      cryptocurrencies = [];
    } else {
      cryptocurrencies = await marketClient.listPaginated({
        counterCurrency,
        range,
        limit,
        page,
        order,
        orderBy,
        ids,
      });
    }

    const currencies = mergeFavoriteAndSupportedCurrencies(
      favoriteCryptocurrencies,
      cryptocurrencies,
      supportedCurrenciesByLedger,
    );

    limit = DEFAULT_PAGE_LIMIT;
    coinsCount = coins.length;

    if (!currencies.length) {
      coinsCount = 0;
    } else if (ids.length) {
      limit = page === 1 ? cryptocurrencies.length : limit;
      coinsCount = ids.length;
    }

    dispatch(
      setMarketParams({
        currencies,
        loading: false,
        favorites: favoriteCryptocurrencies,
        limit,
        ids,
        coins,
        coinsCount,
      }),
    );
  };

export function mergeFavoriteAndSupportedCurrencies(
  favorites: Array<FavoriteCryptoCurrency>,
  cryptocurrencies: Array<MarketCurrencyInfo>,
  supportedCurrenciesByLedger?: Array<Currency>,
) {
  cryptocurrencies.forEach(currency => {
    currency.isStarred = false;
    favorites &&
      favorites.forEach(item => {
        if (item.id === currency.id) {
          currency.isStarred = true;
        }
      });
    supportedCurrenciesByLedger &&
      supportedCurrenciesByLedger.forEach(supportedCurrency => {
        if (currency.id === supportedCurrency.id) {
          currency.supportedCurrency = supportedCurrency;
        }
      });
  });
  return cryptocurrencies;
}

export const matchesSearch = (
  search?: string,
  currency: { name: string, symbol: string },
): boolean => {
  if (!search) return true;
  const match = `${currency.symbol}|${currency.name}`;
  return match.toLowerCase().includes(search.toLowerCase());
};
