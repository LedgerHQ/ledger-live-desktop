// @flow

import invariant from "invariant";
import React, { useEffect } from "react";
import { prepareCurrency } from "~/renderer/bridge/cache";
import TrackPage from "~/renderer/analytics/TrackPage";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { command } from "~/renderer/commands";
import type { StepProps } from "..";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";

const connectAppExec = command("connectApp");

const mapResult = ({ opened, device, appAndVersion, displayUpgradeWarning }) =>
  opened && device && !displayUpgradeWarning
    ? {
        device,
        appAndVersion,
      }
    : null;

const getInitialState = (device?) => ({
  isLoading: !device,
  requestQuitApp: false,
  requestOpenApp: null,
  unresponsive: false,
  requiresAppInstallation: null,
  allowOpeningRequestedWording: null,
  allowOpeningGranted: false,
  allowManagerRequestedWording: null,
  allowManagerGranted: false,
  device: device,
  opened: !!device,
  appAndVersion: {
    name: "app",
    version: "1.9.14",
  },
  error: null,
  derivation: null,
  displayUpgradeWarning: false,
  installingApp: false,
  listingApps: false,
});

const useHook = (device, appRequest) => {
  return getInitialState({
    deviceName: "speculos",
    modelId: "nanoS",
    deviceId: "somee",
  });
};

// const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const action = { useHook, mapResult };

const StepConnectDevice = ({ currency, device, transitionTo, flow }: StepProps) => {
  invariant(currency, "No crypto asset given");

  // preload currency ahead of time
  useEffect(() => {
    if (currency && currency.type === "CryptoCurrency") {
      prepareCurrency(currency);
    }
  }, [currency]);

  const currencyName = currency
    ? currency.type === "TokenCurrency"
      ? currency.parentCurrency.name
      : currency.name
    : undefined;

  return (
    <>
      <TrackPage category="AddAccounts" name="Step2" currencyName={currencyName} />
      <DeviceAction
        action={action}
        request={{
          currency: currency.type === "TokenCurrency" ? currency.parentCurrency : currency,
        }}
        onResult={() => {
          transitionTo("import");
        }}
        analyticsPropertyFlow={flow}
      />
    </>
  );
};

export default StepConnectDevice;
