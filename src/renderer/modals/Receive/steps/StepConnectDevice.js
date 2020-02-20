// @flow

import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/app";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import TrackPage from "~/renderer/analytics/TrackPage";

import type { StepProps } from "../Body";

export default function StepConnectDevice({
  account,
  parentAccount,
  token,
  transitionTo,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const tokenCurrency = (account && account.type === "TokenAccount" && account.token) || token;
  return (
    <>
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      <DeviceAction
        action={action}
        request={{ account: mainAccount, tokenCurrency }}
        onResult={() => transitionTo("receive")}
      />
    </>
  );
}

export function StepConnectDeviceFooter({ t, transitionTo, onSkipConfirm, device }: StepProps) {
  return (
    <Box horizontal flow={2}>
      <TrackPage category="Receive Flow" name="Step 2" />
      <Button event="Receive Flow Without Device Clicked" onClick={onSkipConfirm}>
        {t("receive.steps.connectDevice.withoutDevice")}
      </Button>
    </Box>
  );
}
