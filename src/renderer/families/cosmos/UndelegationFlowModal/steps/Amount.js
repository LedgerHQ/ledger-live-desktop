// @flow
import type { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import type { FormattedDelegation } from "../../Delegation";
import { ValidatorField, AmountField } from "../fields";
import type { StepProps } from "../types";

export default function StepAmount({
  account,
  transaction,
  bridgePending,
  onUpdateTransaction,
  validatorAddress,
}: StepProps) {
  invariant(account && transaction && transaction.validators, "account and transaction required");

  const bridge = getAccountBridge(account);

  const onChangeValidator = useCallback(
    ({ address, amount }: FormattedDelegation) => {
      onUpdateTransaction(tx =>
        bridge.updateTransaction(tx, {
          ...tx,
          validators: [
            {
              address,
              amount,
            },
          ],
        }),
      );
    },
    [onUpdateTransaction, bridge],
  );

  const onChangeAmount = useCallback(
    (amount: BigNumber) => {
      onUpdateTransaction(tx =>
        bridge.updateTransaction(tx, {
          ...tx,
          validators: [
            {
              ...tx.validators[0],
              amount,
            },
          ],
        }),
      );
    },
    [onUpdateTransaction, bridge],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Undelegation Flow" name="Step 1" />
      <ValidatorField account={account} transaction={transaction} onChange={onChangeValidator} />
      <AmountField account={account} onChange={onChangeAmount} />
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  onClose,
  status: { errors = {} },
  bridgePending,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  invariant(account, "account required");

  const hasErrors = !!Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("device")}>
          {t("common.continue")}
        </Button>
      </Box>
    </>
  );
}
