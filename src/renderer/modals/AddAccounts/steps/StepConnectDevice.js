// @flow

import invariant from "invariant";
import React, { useEffect } from "react";
import { prepareCurrency } from "~/renderer/bridge/cache";
import TrackPage from "~/renderer/analytics/TrackPage";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { command } from "~/renderer/commands";
import type { StepProps } from "..";

const connectAppExec = command("connectApp");
const action = createAction(connectAppExec);

const StepConnectDevice = ({ currency, device, transitionTo }: StepProps) => {
  invariant(currency, "No crypto asset given");

  // preload currency ahead of time
  useEffect(() => {
    if (currency && currency.type === "CryptoCurrency") {
      prepareCurrency(currency);
    }
  }, [currency]);

  return (
    <>
      <TrackPage category="AddAccounts" name="Step2" />
      <DeviceAction
        action={action}
        request={{
          currency: currency.type === "TokenCurrency" ? currency.parentCurrency : currency,
        }}
        onResult={() => {
          transitionTo("import");
        }}
      />
    </>
  );
};

export default StepConnectDevice;
