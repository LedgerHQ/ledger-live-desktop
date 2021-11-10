// @flow
import type {
  FavoriteCryptoCurrency,
  MarketCurrencyInfo,
  MarketFilters,
  MarketState,
} from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";
import { getKey, setKey } from "~/renderer/storage";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import { counterCurrencyNameTable } from "~/renderer/constants/market";
import { openModal, closeModal } from "~/renderer/actions/modals";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import type { ThunkAction } from "redux-thunk";

export const MARKET_DEFAULT_PAGE_LIMIT = 50;
const marketClient = new MarketClient();

export type GetMarketCryptoCurrencies = $Shape<{
    counterCurrency: string,
    range: string,
    limit: number,
    page: number,
    order: string,
    orderBy: string,
}>

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
    const supportedCounterCurrencies: string[] = await marketClient.supportedCounterCurrencies();
    const res: {
      key: string,
      label: string,
      value: string,
    }[] = [];
    supportedCounterCurrencies.forEach((currency, i) => {
      res.push({
        key: currency,
        label: `${currency.toUpperCase()} - ${counterCurrencyNameTable[currency] || currency}`,
        value: currency,
      });
    });
    dispatch(setMarketParams({ counterCurrencies: res }));
  };

export const getMarketCryptoCurrencies: ThunkAction = (
  filterParams: GetMarketCryptoCurrencies = {},
) =>
  async function(dispatch, getState) {
    const state = getState().market;
    const loadMore = filterParams.page && filterParams.page !== state.page || state.failedMarketParams.loadMore;
    filterParams = { ...state, ...filterParams };
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
      currencies,
    } = filterParams;
    const showFavorites: boolean = filters.isFavorite;
    const unShowFavorites: boolean = !filters.isFavorite;
    if (!coinsCount) {
        try {
            coins = await marketClient.supportedCurrencies();
        } catch (e) {
            dispatch(connectionError())
            dispatch(setMarketParams({ failedMarketParams: {
                    counterCurrency: filterParams.counterCurrency,
                    range: filterParams.range,
                    limit: filterParams.limit,
                    page: filterParams.page,
                    order: filterParams.order,
                    orderBy: filterParams.orderBy,
                }}))
        }
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
      limit = MARKET_DEFAULT_PAGE_LIMIT;
    }

    let cryptocurrencies = [];
    if ((showFavorites || searchValue) && !ids.length) {
      cryptocurrencies = [];
    } else {
        try {
            cryptocurrencies = await marketClient.listPaginated({
                counterCurrency,
                range,
                limit,
                page,
                order,
                orderBy,
                ids,
            });
        } catch (e) {
            dispatch(connectionError())
            dispatch(setMarketParams({ failedMarketParams: {
                counterCurrency: filterParams.counterCurrency,
                range: filterParams.range,
                limit: filterParams.limit,
                page: filterParams.page,
                order: filterParams.order,
                orderBy: filterParams.orderBy,
                loadMore
            }}))
        }
    }

    const newCurrencies = mergeFavoriteAndSupportedCurrencies(
      favoriteCryptocurrencies,
      cryptocurrencies,
      supportedCurrenciesByLedger,
    );

    currencies = loadMore ? currencies.concat(newCurrencies) : newCurrencies;

    limit = MARKET_DEFAULT_PAGE_LIMIT;
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
        failedMarketParams: {}
      }),
    );
  };

export const connectionError = (): ThunkAction => async function (dispatch, getState) {
    dispatch(openModal("MODAL_CONNECTION_ERROR"))
}

export const ignoreConnectionError = (): ThunkAction => async function (dispatch, getState) {
    dispatch(setMarketParams({ loading: false }))
    dispatch(closeModal("MODAL_CONNECTION_ERROR"))
}

export const reloadMarket = (): ThukAction => async (dispatch, getState) => {
    const { market: { reload } } = getState();
    dispatch(setMarketParams({ reload: reload + 1 }))
    dispatch(ignoreConnectionError())
}

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
