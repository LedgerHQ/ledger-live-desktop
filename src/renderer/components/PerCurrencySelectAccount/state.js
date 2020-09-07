// @flow

import { useState, useCallback, useMemo } from "react";
import type { Account, SubAccount } from "@ledgerhq/live-common/lib/types/account";
import { makeEmptyTokenAccount } from "@ledgerhq/live-common/lib/account";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";

type CryptoOrTokenCurrency = TokenCurrency | CryptoCurrency;

export type AccountTuple = {
  account: ?Account,
  subAccount: ?SubAccount,
};

function getAccountTuplesForCurrency(
  currency: CryptoOrTokenCurrency,
  allAccounts: Account[],
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
      }));
  }
  return allAccounts
    .filter(account => account.currency.id === currency.id)
    .map(account => ({
      account,
      subAccount: null,
    }));
}

const getIdsFromTuple = (accountTuple: AccountTuple) => ({
  accountId: accountTuple.account ? accountTuple.account.id : null,
  subAccountId: accountTuple.subAccount ? accountTuple.subAccount.id : null,
});

export function useCurrencyAccountSelect({
  allCurrencies,
  allAccounts,
  defaultCurrency,
  defaultAccount,
}: {
  allCurrencies: CryptoOrTokenCurrency[],
  allAccounts: Account[],
  defaultCurrency: ?CryptoOrTokenCurrency,
  defaultAccount: ?Account,
}) {
  const [state, setState] = useState(() => {
    const currency = defaultCurrency || null;
    if (!currency) {
      return { currency: null, accountId: null };
    }
    const availableAccounts = getAccountTuplesForCurrency(currency, allAccounts);
    const { accountId } = defaultAccount
      ? { accountId: defaultAccount.id }
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
    (currency: ?CryptoOrTokenCurrency) => {
      if (currency) {
        const availableAccounts = getAccountTuplesForCurrency(currency, allAccounts);
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
    [allAccounts],
  );

  const setAccount = useCallback((account: ?Account, subAccount: ?SubAccount) => {
    setState(currState => ({
      ...currState,
      accountId: account ? account.id : null,
    }));
  }, []);

  const availableAccounts = useMemo(
    () => (currency ? getAccountTuplesForCurrency(currency, allAccounts) : []),
    [currency, allAccounts],
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
