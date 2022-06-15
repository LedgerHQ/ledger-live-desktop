// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";

import ErrorBanner from "~/renderer/components/ErrorBanner";
import AccountFooter from "~/renderer/modals/Send/AccountFooter";
import Alert from "~/renderer/components/Alert";
import TranslatedError from "~/renderer/components/TranslatedError";

import AssetSelector from "../fields/AssetSelector";

export default function StepAsset({
  account,
  parentAccount,
  onUpdateTransaction,
  transaction,
  status,
  bridgePending,
  warning,
  error,
  t,
}: StepProps) {
  invariant(account && transaction, "account and transaction required");
  const bridge = getAccountBridge(account, parentAccount);

  const getAssetObject = (assetId: string) => {
    const assetString = assetId.split("/")[2];
    const [assetCode, assetIssuer] = assetString.split(":");
    return { assetCode, assetIssuer };
  };

  const onUpdateAsset = useCallback(
    ({ id: assetId }) => {
      onUpdateTransaction(transaction =>
        bridge.updateTransaction(transaction, getAssetObject(assetId)),
      );
    },
    [bridge, onUpdateTransaction],
  );

  return (
    <Box flow={1}>
      <TrackPage category="Stellar add asset" name="Step 1" />
      {warning && !error ? <ErrorBanner error={warning} warning /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <AssetSelector transaction={transaction} account={account} t={t} onChange={onUpdateAsset} />
      <Alert type="primary">
        <Trans i18nKey="stellar.addAsset.steps.assets.info" />
      </Alert>
      {status?.errors?.recipient ? (
        <Alert type="error">
          <TranslatedError error={status.errors.recipient} />
        </Alert>
      ) : null}
    </Box>
  );
}

export function StepAssetFooter({
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
        <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
          <Trans i18nKey="common.continue" />
        </Button>
      </Box>
    </>
  );
}
