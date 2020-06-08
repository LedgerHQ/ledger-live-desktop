// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { BigNumber } from "bignumber.js";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import ValidatorField from "../fields/ValidatorField";

export default function StepValidators({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  error,
  bridgePending,
  transitionTo,
  t,
}: StepProps) {
  invariant(account && account.cosmosResources && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const updateRedelegation = useCallback(
    newTransaction => {
      onUpdateTransaction(transaction => bridge.updateTransaction(transaction, newTransaction));
    },
    [bridge, onUpdateTransaction],
  );

  const updateDestinationValidator = useCallback(
    ({ address }) => {
      updateRedelegation({
        ...transaction,
        validators: [
          {
            address,
            amount:
              transaction.validators && transaction.validators[0]
                ? transaction.validators[0].amount || BigNumber(0)
                : BigNumber(0),
          },
        ],
      });
      transitionTo("validators");
    },
    [updateRedelegation, transaction, transitionTo],
  );

  return (
    <ValidatorField
      transaction={transaction}
      account={account}
      t={t}
      onChange={updateDestinationValidator}
      isOpen
    />
  );
}
