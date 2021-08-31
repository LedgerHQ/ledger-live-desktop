// @flow
import { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";
import useBridgeTransaction from "@ledgerhq/live-common/lib/bridge/useBridgeTransaction";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getAbandonSeedAddress } from "@ledgerhq/live-common/lib/currencies";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { AmountRequired } from "@ledgerhq/errors";

import { shallowAccountsSelector } from "~/renderer/reducers/accounts";

const useSwapTransaction = () => {
  const allAccounts = useSelector(shallowAccountsSelector);
  const { updateTransaction, ...bridgeTransaction } = useBridgeTransaction();
  const fromAmountError = useMemo(() => {
    const [error] = [
      bridgeTransaction.status.errors?.gasPrice,
      bridgeTransaction.status.errors?.amount,
    ]
      .filter(Boolean)
      .filter(error => !(error instanceof AmountRequired));

    return error;
  }, [bridgeTransaction.status.errors?.gasPrice, bridgeTransaction.status.errors?.amount]);

  /* UPDATE from account */
  const setAccount = (pickedAccount: Account | TokenAccount): void => {
    const parentAccount =
      pickedAccount?.type !== "Account"
        ? allAccounts.find(a => a.id === pickedAccount?.parentId)
        : null;

    bridgeTransaction.setAccount(pickedAccount, parentAccount);

    /* @DEV: That populates fake seed. This is required to use Transaction object */
    const mainAccount = getMainAccount(pickedAccount, parentAccount);
    const currency = getAccountCurrency(mainAccount);
    const recipient = getAbandonSeedAddress(currency.id);
    updateTransaction(transaction => ({ ...transaction, recipient }));
  };

  const setFromAmount = (amount: BigNumber) =>
    updateTransaction(transaction => ({ ...transaction, amount }));

  const toggleMax = async () => {
    /* UPDATE useAllAmount value */
    const newAllAmountValue = !bridgeTransaction.transaction.useAllAmount;
    updateTransaction(transaction => ({ ...transaction, useAllAmount: newAllAmountValue }));

    /* UPDATE amount to the max value if needed */
    if (newAllAmountValue) {
      const bridge = getAccountBridge(bridgeTransaction.account, bridgeTransaction.parentAccount);
      const amount = await bridge.estimateMaxSpendable({
        account: bridgeTransaction.account,
        parentAccount: bridgeTransaction.parentAccount,
      });

      updateTransaction(transaction => ({ ...transaction, amount }));
    }
  };

  return {
    ...bridgeTransaction,
    setFromAmount,
    toggleMax,
    setAccount,
    fromAmountError,
  };
};

export default useSwapTransaction;
