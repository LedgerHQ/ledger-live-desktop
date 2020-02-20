// @flow

import invariant from "invariant";
import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { StepProps } from "~/renderer/modals/MigrateAccounts";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/app";

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
