// @flow
import React, { useEffect, useState } from "react";
import type { Account, AccountLike, Transaction } from "@ledgerhq/live-common/lib/types";
import { useDebounce } from "@ledgerhq/live-common/lib//hooks/useDebounce";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import FormattedVal from "~/renderer/components/FormattedVal";

type Props = {
  account: AccountLike,
  transaction: Transaction,
  parentAccount: ?Account,
  prefix?: string,
  showAllDigits?: boolean,
  disableRounding?: boolean,
};

const SpendableAmount = ({
  account,
  parentAccount,
  transaction,
  prefix,
  showAllDigits,
  disableRounding,
}: Props) => {
  const [maxSpendable, setMaxSpendable] = useState(null);

  const debouncedTransaction = useDebounce(transaction, 500);

  useEffect(() => {
    if (!account) return;
    let cancelled = false;
    getAccountBridge(account, parentAccount)
      .estimateMaxSpendable({
        account,
        parentAccount,
        transaction: debouncedTransaction,
      })
      .then(estimate => {
        if (cancelled) return;
        setMaxSpendable(estimate);
      });

    return () => {
      cancelled = true;
    };
  }, [account, parentAccount, debouncedTransaction]);

  const accountUnit = getAccountUnit(account);

  return maxSpendable ? (
    <FormattedVal
      style={{ width: "auto" }}
      color="palette.text.shade100"
      val={maxSpendable}
      unit={accountUnit}
      prefix={prefix}
      disableRounding={disableRounding}
      showAllDigits={showAllDigits}
      showCode
      alwaysShowValue
    />
  ) : null;
};

export default SpendableAmount;
