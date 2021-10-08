// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";
import { getKey, setKey } from "~/renderer/storage";

export const setMarketParams = (payload: MarketState) => ({
  type: "SET_MARKET_PARAMS",
  payload,
});

export const setMarketRange = (range: string) => ({
  type: "SET_MARKET_RANGE",
  payload: range,
});

export const setMarketCounterValue = (counterValue: string) => ({
  type: "SET_MARKET_COUNTERVALUE",
  payload: counterValue,
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

    await setKey("app", "favorite_cryptocurrencies", favorites);
    const currenciesWithFavorites = mergeFavoritesWithCurrencies(favorites, currencies);
    dispatch(setMarketParams({ favorites, currencies: currenciesWithFavorites }));
  };

export const toggleMarketLoading = ({ loading }: { loading: boolean }) => ({
  type: "TOGGLE_MARKET_LOADING",
  payload: { loading },
});

export const getMarketCryptoCurrencies = (filters: {
  counterCurrencyValue: string,
  range: string,
  limit: number,
  page: number,
  order: string,
  orderBy: string,
}) =>
  async function(dispatch, getState) {
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

    const marketClient = new MarketClient();
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
    const currenciesWithFavorites = mergeFavoritesWithCurrencies(favoriteCryptocurrencies, res);
    dispatch(
      setMarketParams({
        currencies: currenciesWithFavorites,
        loading: false,
        favorites: favoriteCryptocurrencies,
        ids,
        ...filters,
      }),
    );
  };

export function mergeFavoritesWithCurrencies(favorites, cryptocurrencies) {
  cryptocurrencies.forEach(currency => {
    currency.isStarred = false;
    favorites.forEach(item => {
      if (item.id === currency.id) {
        currency.isStarred = true;
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
