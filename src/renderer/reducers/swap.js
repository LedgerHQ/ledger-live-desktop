// @flow
import { handleActions } from "redux-actions";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/exchange/swap/types";

export type SwapStateType = {
  providers: ?Array<AvailableProvider>,
  currentProvider: ?AvailableProvider,
};

const initialState: SwapStateType = { providers: null, currentProvider: null };

type UPDATE_PROVIDERS_TYPE = {
  payload: $NonMaybeType<$PropertyType<SwapStateType, "providers">>,
};

const handlers = {
  UPDATE_PROVIDERS: (state: SwapStateType, { payload: providers }: UPDATE_PROVIDERS_TYPE) => {
    /* Manage the case when no providers are available
       Overwrite current provider to default value is required on update */
    if (providers.length === 0)
      return { ...state, providers: providers, currentProvider: initialState.currentProvider };

    // Manage the initial storage
    if (state.currentProvider === null)
      return { ...state, providers: providers, currentProvider: providers[0] };

    const isCurrentPickable = providers.find(({ provider }) => provider === state.currentProvider);
    const currentProvider = isCurrentPickable ? state.currentProvider : providers[0];
    return { ...state, providers, currentProvider };
  },
  RESET_STATE: () => ({ ...initialState }),
};

const options = { prefix: "SWAP" };

export default handleActions(handlers, initialState, options);
