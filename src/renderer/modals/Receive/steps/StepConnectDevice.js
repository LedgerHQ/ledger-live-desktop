// @flow

import React from "react";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import TrackPage from "~/renderer/analytics/TrackPage";
import { command } from "~/renderer/commands";

import type { StepProps } from "../Body";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

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
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      <DeviceAction
        action={action}
        request={{ account: mainAccount, tokenCurrency }}
        onResult={() => transitionTo("receive")}
        analyticsPropertyFlow="receive"
      />
    </>
  );
}

export function StepConnectDeviceFooter({
  t,
  transitionTo,
  onSkipConfirm,
  device,
  eventType,
  currencyName,
}: StepProps) {
  return (
    <Box horizontal flow={2}>
      <TrackPage
        category={`Receive Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step 2"
        currencyName={currencyName}
      />
      <Button
        event="Receive Flow Without Device Clicked"
        id={"receive-connect-device-skip-device-button"}
        onClick={onSkipConfirm}
      >
        {t("receive.steps.connectDevice.withoutDevice")}
      </Button>
    </Box>
  );
}
