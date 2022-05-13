// @flow
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import type { AccountBridge, Transaction } from "@ledgerhq/live-common/lib/types";

import ValidatorField from "../fields/ValidatorField";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

export default function StepDelegation({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  error,
  t,
}: StepProps) {
  invariant(account && transaction && transaction.validators, "account and transaction required");
  const { cosmosResources } = account;

  invariant(cosmosResources, "cosmosResources required");

  const delegations = cosmosResources.delegations || [];

  const updateValidator = ({ address }: { address: string }) => {
    const bridge: AccountBridge<Transaction> = getAccountBridge(account, parentAccount);
    onUpdateTransaction(tx => {
      return bridge.updateTransaction(transaction, {
        validators: [
          {
            address: address,
            amount: BigNumber(0),
          },
        ],
      });
    });
  };

  const chosenVoteAccAddr = transaction.validators[0]?.address || "";

  return (
    <Box flow={1}>
      <TrackPage category="Delegation Flow" name="Step Validator" />
      {error && <ErrorBanner error={error} />}
      <ValidatorField
        account={account}
        status={status}
        t={t}
        delegations={delegations}
        onChangeValidator={updateValidator}
        chosenVoteAccAddr={chosenVoteAccAddr}
      />
    </Box>
  );
}

export function StepDelegationFooter({
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
  const canNext =
    !bridgePending && !errors.validators && transaction && transaction.validators.length > 0;

  return (
    <>
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          id="delegate-continue-button"
          disabled={!canNext}
          primary
          onClick={() => transitionTo("amount")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
