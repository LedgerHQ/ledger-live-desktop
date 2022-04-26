// @flow
import invariant from "invariant";
import React, { Fragment, useCallback } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";
import DelegationSelectorField from "../fields/DelegationSelectorField";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

export default function StepWithdraw({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  warning,
  error,
  t,
  unbondings,
  contract,
  amount,
}: StepProps) {
  const bridge = getAccountBridge(account, parentAccount);

  const onDelegationChange = useCallback(
    validator => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, {
          ...transaction,
          recipient: validator.contract,
          amount: BigNumber(validator.amount),
        }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="ClaimRewards Flow" name="Step 1" />
      {warning && !error ? <ErrorBanner error={warning} warning={true} /> : null}
      {error ? <ErrorBanner error={error} /> : null}

      {transaction.amount.gt(0) && (
        <Text fontSize={4} ff="Inter|Medium" textAlign="center">
          <Trans
            i18nKey="elrond.withdraw.flow.steps.withdraw.description"
            values={{
              amount: `${denominate({
                input: String(transaction.amount),
                showLastNonZeroDecimal: true,
              })} ${constants.egldLabel}`,
            }}
          >
            <b></b>
          </Trans>
        </Text>
      )}

      <DelegationSelectorField
        contract={contract}
        unbondings={unbondings}
        amount={amount}
        t={t}
        onChange={onDelegationChange}
        bridge={bridge}
        transaction={transaction}
        onUpdateTransaction={onUpdateTransaction}
      />
    </Box>
  );
}

export function StepWithdrawFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <Fragment>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal={true}>
        <Button mr={1} secondary={true} onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary={true} onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </Fragment>
  );
}
