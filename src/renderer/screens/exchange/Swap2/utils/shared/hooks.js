// @flow
import { useReducer, useEffect } from "react";
import type { AvailableProviderV3 } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";

type State = {
  isLoading: boolean,
  error: ?Error,
  providers: ?Array<AvailableProviderV3>,
};

type ActionType =
  | { type: "SAVE_DATA", payload: $PropertyType<State, "providers"> }
  | { type: "SAVE_ERROR", payload: $PropertyType<State, "error"> };

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case "SAVE_DATA":
      return { error: null, providers: action.payload, isLoading: false };
    case "SAVE_ERROR":
      return { error: action.payload, providers: null, isLoading: false };
    default:
      throw new Error("Uncorrect action type");
  }
};

export const initialState = { isLoading: true, error: null, providers: null };

const filterDisabledProviders = (provider: AvailableProviderV3) =>
  !process.env.SWAP_DISABLED_PROVIDERS?.includes(provider.provider);

export const useSwapProviders = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let isMounted = true;

    const saveProviders = async () => {
      try {
        // TODO: Fix type issue AvailableProviderV2 -> : Array<AvailableProviderV3>
        const allProviders = await getProviders();
        const providers = allProviders.filter(filterDisabledProviders);

        if (isMounted) dispatch({ type: "SAVE_DATA", payload: providers });
      } catch (error) {
        if (isMounted) dispatch({ type: "SAVE_ERROR", payload: error });
      }
    };

    saveProviders();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
};
