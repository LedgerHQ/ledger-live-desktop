// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

import type { StepProps } from "../types";
import AmountField from "../fields/AmountField";

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");

  const onLearnMore = useCallback(() => openURL(urls.stakingPolkadot), []);

  return (
    <Box flow={1}>
      <SyncSkipUnderPriority priority={100} />
      <TrackPage category="Bond Flow" name="Step 1" />
      {error && <ErrorBanner error={error} />}
      <Box
        flex="1"
        mb={4}
        borderRadius={4}
        horizontal
        alignItems="center"
        p={2}
        bg="palette.divider"
        color="palette.text.shade100"
      >
        <Box mr={2}>
          <InfoCircle size={12} />
        </Box>
        <Box flex="1" style={{ wordBreak: "break-all" }}>
          <Text
            ff="Inter|SemiBold"
            textAlign="left"
            fontSize={3}
            style={{ wordBreak: "break-word" }}
          >
            <Trans i18nKey="polkadot.rebond.steps.amount.info" />
          </Text>
          <LinkWithExternalIcon
            label={<Trans i18nKey="polkadot.rebond.steps.amount.learnMore" />}
            onClick={onLearnMore}
          />
        </Box>
      </Box>
      <AmountField
        transaction={transaction}
        account={account}
        parentAccount={parentAccount}
        bridgePending={bridgePending}
        onChangeTransaction={onChangeTransaction}
        status={status}
        t={t}
      />
    </Box>
  );
}

export function StepAmountFooter({
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
      <AccountFooter parentAccount={parentAccount} account={account} status={status} />
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          <Trans i18nKey="common.cancel" />
        </Button>
        <Button
          disabled={!canNext}
          isLoading={bridgePending}
          primary
          onClick={() => transitionTo("connectDevice")}
        >
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
