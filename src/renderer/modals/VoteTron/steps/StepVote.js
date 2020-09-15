// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import type { StepProps } from "../types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import VotesField from "../fields/VotesField";
import SRInfoPopover from "../Info/Body/SRInfoPopover";

export default function StepVote({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction && transaction.votes, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const updateVote = useCallback(
    updater => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, { votes: updater(transaction.votes) }),
      );
    },
    [bridge, onUpdateTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Vote Flow" name="Step 1" />
      <VotesField
        account={account}
        votes={transaction.votes}
        bridgePending={bridgePending}
        onChangeVotes={updateVote}
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

  return (
    <>
      <SRInfoPopover color="palette.primary.main" />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
