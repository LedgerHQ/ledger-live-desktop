// @flow
import invariant from "invariant";
import React, { useCallback } from "react";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import type { Vote } from "@ledgerhq/live-common/lib/families/tron/types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import VotesField from "../fields/VotesField";

export default function StepVote({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction && transaction.votes, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const onChangeVotes = useCallback(
    (votes: Vote[]) => {
      onChangeTransaction(bridge.updateTransaction(transaction, { votes }));
    },
    [bridge, transaction, onChangeTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Vote Flow" name="Step 1" />
      <VotesField
        transaction={transaction}
        account={account}
        votes={transaction.votes}
        bridgePending={bridgePending}
        onChangeVotes={onChangeVotes}
        status={status}
        t={t}
      />
    </Box>
  );
}

export function StepVoteFooter({
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

  // @TODO add in the support popover info
  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
