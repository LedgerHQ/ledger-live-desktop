// @flow
import { openModal } from "~/renderer/actions/modals";
import { counterCurrencyNameTable } from "~/renderer/constants/market";
import { CONNECTION_ERROR, SET_MARKET_PARAMS } from "~/renderer/contexts/actionTypes";
import type { FavoriteCryptoCurrency, MarketState } from "~/renderer/reducers/market";
import { getKey, setKey } from "~/renderer/storage";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import {
  MARKET_DEFAULT_PAGE_LIMIT,
  matchesSearch,
  mergeFavoriteAndSupportedCurrencies,
} from "~/renderer/actions/market";
import { MarketClient } from "~/api/market";
import type { ContextAction } from "~/renderer/contexts/MarketContext";
import type { Dispatch } from "redux";

const marketClient = new MarketClient();

const handlers = {
  CONNECTION_ERROR: ({ reduxDispatch }: { reduxDispatch: Dispatch<any> }) => {
    reduxDispatch(openModal("MODAL_CONNECTION_ERROR"));
  },
  UPDATE_FAVORITE_CRYPTOCURRENCIES: async (
    {
      state,
      dispatch,
    }: {
      state: MarketState,
      dispatch: (type: string, payload: any) => Promise<any>,
    },
    {
      cryptocurrencyId,
      isStarred,
    }: {
      cryptocurrencyId: string,
      isStarred: boolean,
    },
  ) => {
    let { favorites, currencies } = state;

    if (isStarred) {
      favorites = favorites.filter(favorite => favorite.id !== cryptocurrencyId);
    } else {
      favorites.push({ id: cryptocurrencyId });
    }

    await setKey("app", "favorite_cryptocurrencies", favorites);
    const currenciesWithFavorites = mergeFavoriteAndSupportedCurrencies(
      favorites,
      currencies,
    );

    dispatch(SET_MARKET_PARAMS, { favorites, currenciesWithFavorites });
  },
  GET_COUNTER_CURRENCIES: async ({
    dispatch,
  }: {
    dispatch: (type: string, payload: any) => Promise<any>,
  }) => {
    const supportedCounterCurrencies: string[] = await marketClient.supportedCounterCurrencies();
    const res: {
      key: string,
      label: string,
      value: string,
    }[] = [];
    supportedCounterCurrencies.forEach(currency => {
      res.push({
        key: currency,
        label: `${currency.toUpperCase()} - ${counterCurrencyNameTable[currency] || currency}`,
        value: currency,
      });
    });
    dispatch(SET_MARKET_PARAMS, { counterCurrencies: res });
  },
  GET_MARKET_CRYPTO_CURRENCIES: async ({
    dispatch,
    state,
    action,
    reduxDispatch,
  }: {
    dispatch: (type: string, payload: any) => Promise<any>,
    state: MarketState,
    action: ContextAction,
    reduxDispatch: Dispatch<any>,
  }): Promise<any> => {
    let filterParams = action.payload;
    const loadMore = action.payload.loadMore || state.failedMarketParams.loadMore;
    try {
      filterParams = { ...state, ...filterParams };
      await dispatch(SET_MARKET_PARAMS, {
        loading: true,
      });

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
        limit = MARKET_DEFAULT_PAGE_LIMIT;
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

      await dispatch(SET_MARKET_PARAMS, {
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
        error: false,
        currencies,
        loading: false,
        favorites: favoriteCryptocurrencies,
      });
    } catch (e) {
      await dispatch(CONNECTION_ERROR, { reduxDispatch });
      await dispatch(SET_MARKET_PARAMS, {
        error: true,
        loading: false,
        failedMarketParams: {
          counterCurrency: filterParams.counterCurrency,
          range: filterParams.range,
          limit: filterParams.limit,
          page: filterParams.page,
          order: filterParams.order,
          orderBy: filterParams.orderBy,
          loadMore,
        },
      });
    }
  },
};

export default handlers;
