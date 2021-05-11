// @flow
import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Alert from "~/renderer/components/Alert";
import Text from "~/renderer/components/Text";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";

export default function StepInfo({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  warning,
  error,
  t,
  mode,
}: StepProps) {
  invariant(
    account && account.polkadotResources && transaction,
    "account and transaction required",
  );

  return (
    <Box flow={1}>
      <TrackPage category="SimpleOperationFlow Flow" name="Step 1" />
      {warning && !error ? <ErrorBanner error={warning} warning /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box px={5} py={2}>
        {/* <Box horizontal justifyContent="center" mb={4}>
          <Image alt="" resource={ClaimRewardsIllu} width="100" />
        </Box> */}

        <Text textAlign="center" ff="Inter|Medium" fontSize={4}>
          <Trans i18nKey={`polkadot.simpleOperation.modes.${mode}.description`} />
        </Text>
      </Box>

      {mode !== "withdrawUnbonded" ? (
        <Alert type="primary" learnMoreUrl={urls.stakingPolkadot}>
          <Trans i18nKey={`polkadot.simpleOperation.modes.${mode}.info`} />
        </Alert>
      ) : null}
    </Box>
  );
}

export function StepInfoFooter({
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
