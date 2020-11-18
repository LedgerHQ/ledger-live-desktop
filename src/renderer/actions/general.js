// @flow
import { useMemo, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { OutputSelector } from "reselect";
import { createSelector } from "reselect";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { isAccountDelegating } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import {
  nestedSortAccounts,
  flattenSortAccounts,
  sortAccountsComparatorFromOrder,
} from "@ledgerhq/live-common/lib/account";
import type { FlattenAccountsOptions } from "@ledgerhq/live-common/lib/account";
import {
  useDistribution as useDistributionCommon,
  useCalculateCountervalueCallback as useCalculateCountervalueCallbackCommon,
} from "@ledgerhq/live-common/lib/countervalues/react";
import { inferTrackingPairForAccounts } from "@ledgerhq/live-common/lib/countervalues/logic";
import { pairId } from "@ledgerhq/live-common/lib/countervalues/helpers";
import type { State } from "~/renderer/reducers";
import { accountsSelector, activeAccountsSelector } from "~/renderer/reducers/accounts";
import { osDarkModeSelector } from "~/renderer/reducers/application";
import {
  getOrderAccounts,
  counterValueCurrencySelector,
  userThemeSelector,
} from "~/renderer/reducers/settings";

// provide redux states via custom hook wrapper

export function useDistribution() {
  const accounts = useSelector(accountsSelector);
  const to = useSelector(counterValueCurrencySelector);
  return useDistributionCommon({ accounts, to });
}

export function useCalculateCountervalueCallback() {
  const to = useSelector(counterValueCurrencySelector);
  return useCalculateCountervalueCallbackCommon({ to });
}

export function useSortAccountsComparator() {
  const accounts = useSelector(getOrderAccounts);
  const calc = useCalculateCountervalueCallback();

  return sortAccountsComparatorFromOrder(accounts, calc);
}

export function useNestedSortAccounts() {
  const accounts = useSelector(accountsSelector);
  const comparator = useSortAccountsComparator();

  return useMemo(() => nestedSortAccounts(accounts, comparator), [accounts, comparator]);
}

export function useFlattenSortAccounts(options?: FlattenAccountsOptions) {
  const accounts = useSelector(accountsSelector);
  const comparator = useSortAccountsComparator();
  return useMemo(() => flattenSortAccounts(accounts, comparator, options), [
    accounts,
    comparator,
    options,
  ]);
}

export function useHaveUndelegatedAccounts() {
  const accounts = useFlattenSortAccounts({ enforceHideEmptySubAccounts: true });
  return useMemo(
    () =>
      accounts.some(
        acc => acc.currency && acc.currency.family === "tezos" && !isAccountDelegating(acc),
      ),
    [accounts],
  );
}

export const delegatableAccountsSelector: OutputSelector<
  State,
  void,
  Account[],
> = createSelector(activeAccountsSelector, accounts =>
  accounts.filter(acc => acc.currency.family === "tezos" && !isAccountDelegating(acc)),
);

export function useRefreshAccountsOrdering() {
  const payload = useNestedSortAccounts();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // workaround for not reflecting the latest payload when calling refresh right after updating accounts
  useEffect(() => {
    if (!isRefreshing) {
      return;
    }

    dispatch({
      type: "DB:SET_ACCOUNTS",
      payload,
    });
    setIsRefreshing(false);
  }, [isRefreshing, dispatch, payload]);

  return useCallback(() => {
    setIsRefreshing(true);
  }, []);
}

export function useRefreshAccountsOrderingEffect({
  onMount = false,
  onUnmount = false,
}: {
  onMount?: boolean,
  onUnmount?: boolean,
}) {
  const refreshAccountsOrdering = useRefreshAccountsOrdering();

  useEffect(() => {
    if (onMount) {
      refreshAccountsOrdering();
    }

    return () => {
      if (onUnmount) {
        refreshAccountsOrdering();
      }
    };
  }, [onMount, onUnmount, refreshAccountsOrdering]);
}

export const themeSelector: OutputSelector<State, void, string> = createSelector(
  osDarkModeSelector,
  userThemeSelector,
  (osDark, theme) => theme || (osDark ? "dark" : "light"),
);

export function useUserSettings() {
  const trackingPairs = useTrackingPairs();
  return useMemo(
    () => ({
      trackingPairs,
      autofillGaps: true,
    }),
    [trackingPairs],
  );
}

export function useTrackingPairIds(): string[] {
  const trackingPairs = useTrackingPairs();
  return useMemo(() => trackingPairs.map(p => pairId(p)), [trackingPairs]);
}

export function useTrackingPairs() {
  const accounts = useSelector(accountsSelector);
  const countervalue = useSelector(counterValueCurrencySelector);
  return useMemo(() => inferTrackingPairForAccounts(accounts, countervalue), [
    accounts,
    countervalue,
  ]);
}
