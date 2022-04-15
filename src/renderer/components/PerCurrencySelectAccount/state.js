// @flow

import { useState, useCallback, useMemo } from "react";
import type { Account, SubAccount } from "@ledgerhq/live-common/lib/types/account";
import { makeEmptyTokenAccount } from "@ledgerhq/live-common/lib/account";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";

export type AccountTuple = {
  account: ?Account,
  subAccount: ?SubAccount,
};

export function getAccountTuplesForCurrency(
  currency: CryptoCurrency | TokenCurrency,
  allAccounts: Account[],
  hideEmpty: ?boolean,
): AccountTuple[] {
  if (currency.type === "TokenCurrency") {
    return allAccounts
      .filter(account => account.currency.id === currency.parentCurrency.id)
      .map(account => ({
        account,
        subAccount:
          (account.subAccounts &&
            account.subAccounts.find(
              (subAcc: SubAccount) =>
                subAcc.type === "TokenAccount" && subAcc.token.id === currency.id,
            )) ||
          makeEmptyTokenAccount(account, currency),
      }))
      .filter(a => (hideEmpty ? a.subAccount?.balance.gt(0) : true));
  }
  return allAccounts
    .filter(account => account.currency.id === currency.id)
    .map(account => ({
      account,
      subAccount: null,
    }))
    .filter(a => (hideEmpty ? a.account?.balance.gt(0) : true));
}

const getIdsFromTuple = (accountTuple: AccountTuple) => ({
  accountId: accountTuple.account ? accountTuple.account.id : null,
  subAccountId: accountTuple.subAccount ? accountTuple.subAccount.id : null,
});

export type UseCurrencyAccountSelectReturnType = {
  availableAccounts: Array<AccountTuple>,
  currency: ?CryptoCurrency | TokenCurrency,
  account: ?Account | any,
  subAccount: ?SubAccount | any,
  setAccount: (account: ?Account, subAccount: ?SubAccount) => void,
  setCurrency: (currency: ?(CryptoCurrency | TokenCurrency)) => void,
};
export function useCurrencyAccountSelect({
  allCurrencies,
  allAccounts,
  defaultCurrencyId,
  defaultAccountId,
  hideEmpty,
}: {
  allCurrencies: Array<CryptoCurrency | TokenCurrency>,
  allAccounts: Account[],
  defaultCurrencyId: ?string,
  defaultAccountId: ?string,
  hideEmpty?: ?boolean,
}): UseCurrencyAccountSelectReturnType {
  const [state, setState] = useState(() => {
    const currency = defaultCurrencyId
      ? allCurrencies.find(currency => currency.id === defaultCurrencyId)
      : allCurrencies.length > 0
      ? allCurrencies[0]
      : undefined;
    if (!currency) {
      return { currency: null, accountId: null };
    }
    const availableAccounts = getAccountTuplesForCurrency(currency, allAccounts, hideEmpty);
    const { accountId } = defaultAccountId
      ? { accountId: defaultAccountId }
      : availableAccounts.length
      ? getIdsFromTuple(availableAccounts[0])
      : { accountId: null };

    return {
      currency,
      accountId,
    };
  });

  const { currency, accountId } = state;

  const setCurrency = useCallback(
    (currency: ?CryptoCurrency | TokenCurrency) => {
      if (currency) {
        const availableAccounts = getAccountTuplesForCurrency(currency, allAccounts, hideEmpty);
        const { accountId } = availableAccounts.length
          ? getIdsFromTuple(availableAccounts[0])
          : { accountId: null };

        return setState(currState => ({
          ...currState,
          currency,
          accountId,
        }));
      }
      return setState(currState => ({
        ...currState,
        currency,
        accountId: null,
      }));
    },
    [allAccounts, hideEmpty],
  );

  const setAccount = useCallback((account: ?Account, subAccount: ?SubAccount) => {
    setState(currState => ({
      ...currState,
      accountId: account ? account.id : null,
    }));
  }, []);

  const availableAccounts = useMemo(
    () => (currency ? getAccountTuplesForCurrency(currency, allAccounts, hideEmpty) : []),
    [currency, allAccounts, hideEmpty],
  );

  const { account, subAccount } = useMemo(() => {
    return (
      availableAccounts.find(tuple => (tuple.account ? tuple.account.id === accountId : false)) || {
        account: null,
        subAccount: null,
      }
    );
  }, [availableAccounts, accountId]);

  return {
    availableAccounts,
    currency,
    account,
    subAccount,
    setAccount,
    setCurrency,
  };
}
