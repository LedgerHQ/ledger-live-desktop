// @flow

import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Transaction } from "@ledgerhq/live-common/lib/families/ethereum/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import FeeSliderField from "~/renderer/components/FeeSliderField";
import { inferDynamicRange } from "@ledgerhq/live-common/lib/range";

type Props = {
  account: Account,
  transaction: Transaction,
  status: TransactionStatus,
  updateTransaction: (updater: any) => void,
};

const fallbackGasPrice = inferDynamicRange(BigNumber(10e9));
let lastNetworkGasPrice; // local cache of last value to prevent extra blinks

const FeesField = ({ account, transaction, status, updateTransaction }: Props) => {
  invariant(transaction.family === "ethereum", "FeeField: ethereum family expected");

  const bridge = getAccountBridge(account);

  const onGasPriceChange = useCallback(
    gasPrice => {
      updateTransaction(transaction =>
        bridge.updateTransaction(transaction, { gasPrice, feesStrategy: "advanced" }),
      );
    },
    [updateTransaction, bridge],
  );

  const networkGasPrice = transaction.networkInfo && transaction.networkInfo.gasPrice;
  if (!lastNetworkGasPrice && networkGasPrice) {
    lastNetworkGasPrice = networkGasPrice;
  }
  const range = networkGasPrice || lastNetworkGasPrice || fallbackGasPrice;
  const gasPrice = transaction.gasPrice || range.initial;
  const { units } = account.currency;

  return (
    <FeeSliderField
      range={range}
      defaultValue={range.initial}
      value={gasPrice}
      onChange={onGasPriceChange}
      unit={units.length > 1 ? units[1] : units[0]}
      error={status.errors.gasPrice}
    />
  );
};

export default FeesField;
