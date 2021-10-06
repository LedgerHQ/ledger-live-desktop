// @flow
import { MarketFilters, MarketState } from "~/renderer/reducers/market";
import { MarketClient } from "~/api/market";

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
  favorites,
}: {
  cryptocurrencyId: number,
  isStarred: boolean,
}) => ({
  type: "UPDATE_FAVORITE_CRYPTOCURRENCIES",
  payload: { cryptocurrencyId, isStarred, favorites },
});

export const toggleMarketLoading = ({ loading }: { loading: boolean }) => ({
  type: "TOGGLE_MARKET_LOADING",
  payload: { loading },
});

export const getMarketCryptoCurrencies = (filters: {
  counterCurrency: string,
  range: string,
  limit: number,
  page: number,
}) =>
  async function(dispatch, getState) {
    const {
      market: { counterCurrency, range, limit, page, coinsCount },
    } = getState();

    dispatch(setMarketParams({ loading: true, ...filters }));

    const marketClient = new MarketClient();
    if (coinsCount === undefined) {
      const coins = await marketClient.supportedCurrencies();
      dispatch(setMarketParams({ coins: coins, coinsCount: coins.length }));
    }
    const res = await marketClient.listPaginated({
      counterCurrency,
      range,
      limit,
      page,
      ...filters,
    });
    dispatch(setMarketParams({ currencies: res, page, loading: false }));
  };
