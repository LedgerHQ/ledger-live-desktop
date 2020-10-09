// @flow

import { useEffect, useState } from "react";
import { BigNumber } from "bignumber.js";
import type { Account, AccountLike, Transaction } from "@ledgerhq/live-common/lib/types";
import { useDebounce } from "@ledgerhq/live-common/lib/hooks/useDebounce";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

type Args = {
  account: AccountLike,
  parentAccount: ?Account,
  transaction: Transaction,
};

const useMaxSpendable = ({ account, parentAccount, transaction }: Args): BigNumber => {
  const [maxSpendable, setMaxSpendable] = useState(null);

  const debounceTransaction = useDebounce(transaction, 500);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    getAccountBridge(account, parentAccount)
      .estimateMaxSpendable({
        account,
        parentAccount,
        transaction: debounceTransaction,
      })
      .then(estimate => {
        console.log({ estimate: estimate.toString() });
        if (cancelled) return;
        setMaxSpendable(estimate);
      });

    return () => {
      cancelled = true;
    };
  }, [account, parentAccount, debounceTransaction]);

  return BigNumber(maxSpendable);
};

export default useMaxSpendable;
