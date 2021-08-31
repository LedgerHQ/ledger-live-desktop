// @flow
import { createAction } from "redux-actions";
import { createSelector } from "reselect";
import type { OutputSelector } from "reselect";
import type { State } from "~/renderer/reducers";
import type { SwapStateType, UPDATE_PROVIDERS_TYPE } from "~/renderer/reducers/swap";
import memoize from "lodash/memoize";

/* ACTIONS */
export const updateProvidersAction = createAction<$PropertyType<UPDATE_PROVIDERS_TYPE, "payload">>(
  "SWAP/UPDATE_PROVIDERS",
);

export const resetSwapAction = createAction("SWAP/RESET_STATE");

/* SELECTORS */
export const providersSelector: OutputSelector<
  State,
  void,
  $PropertyType<SwapStateType, "providers">,
> = createSelector(
  state => state.swap,
  swap => swap.providers,
);

const filterAvaibleToAssets = (pairs, fromId?: string) => {
  if (pairs === null || pairs === undefined) return null;

  if (fromId)
    return pairs.reduce((acc, pair) => (pair.from === fromId ? [...acc, pair.to] : acc), []);

  return pairs.reduce((acc, pair) => [...acc, pair.to], []);
};

export const toSelector: OutputSelector<State, void, *> = createSelector(
  state => state.swap.pairs,
  pairs =>
    memoize((fromId?: "string") => {
      const filteredAssets = filterAvaibleToAssets(pairs, fromId);
      const uniqueAssetList = [...new Set(filteredAssets)];
      return uniqueAssetList;
    }),
);
