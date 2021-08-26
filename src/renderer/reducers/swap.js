// @flow
import { handleActions } from "redux-actions";
import type {
  AvailableProviderV3,
  Transaction,
} from "@ledgerhq/live-common/lib/exchange/swap/types";
export type SwapStateType = {
  providers: ?Array<AvailableProviderV3>,
  pairs: ?$PropertyType<AvailableProviderV3, "pairs">,
  transaction: ?Transaction,
};

const initialState: SwapStateType = { providers: null, pairs: null, transaction: null };

export const flattenPairs = (
  acc: Array<{ from: string, to: string }>,
  value: AvailableProviderV3,
) => [...acc, ...value.pairs];

export type UPDATE_PROVIDERS_TYPE = {
  payload: $NonMaybeType<$PropertyType<SwapStateType, "providers">>,
};
const updateProviders = (state: SwapStateType, { payload: providers }: UPDATE_PROVIDERS_TYPE) => {
  const pairs = providers.reduce(flattenPairs, []);

  return { ...initialState, providers: providers, pairs };
};

const handlers = {
  UPDATE_PROVIDERS: updateProviders,
  UPDATE_TRANSACTION: (state: SwapStateType, { payload }: { payload: ?Transaction }) => ({
    ...state,
    transaction: payload,
  }),
  RESET_STATE: () => ({ ...initialState }),
};

const options = { prefix: "SWAP" };

export default handleActions(handlers, initialState, options);
