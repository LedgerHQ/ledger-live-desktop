// @flow

import React from "react";

import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getMainAccount, getReceiveFlowError } from "@ledgerhq/live-common/lib/account";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";

export default function StepAmount({ token, account, parentAccount, receiveTokenMode }: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const error = account ? getReceiveFlowError(account, parentAccount) : null;

  return (
    <Box flow={1}>
      <TrackPage category="Receive Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  receiveTokenMode,
  token,
  account,
  parentAccount,
  onClose,
}: StepProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button
        disabled={!account || (receiveTokenMode && !token) || !!error}
        primary
        onClick={() => transitionTo("device")}
      >
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}
