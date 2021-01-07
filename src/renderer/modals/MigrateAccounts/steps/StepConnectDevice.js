// @flow

import invariant from "invariant";
import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { StepProps } from "~/renderer/modals/MigrateAccounts";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";

const connectAppExec = command("connectApp");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const StepConnectDevice = ({ t, currency, device, transitionTo }: StepProps) => {
  invariant(currency, "missing account/currency data");
  return (
    <>
      <TrackPage category="MigrateAccounts" name="Step2" />
      <DeviceAction
        action={action}
        request={{ currency }}
        onResult={() => {
          transitionTo("currency");
        }}
      />
    </>
  );
};

export default StepConnectDevice;
