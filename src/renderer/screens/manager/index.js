// @flow
import React, { useState, useCallback } from "react";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import Disconnected from "./Disconnected";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const Manager = () => {
  const [appsToRestore, setRestoreApps] = useState();
  const [result, setResult] = useState(null);
  const [hasReset, setHasReset] = useState(false);
  const onReset = useCallback((apps, firmwareUpdateOpened) => {
    setRestoreApps(apps);
    setResult(null);
    if (!firmwareUpdateOpened) setHasReset(true);
  }, []);
  const onResult = useCallback(result => setResult(result), []);

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Dashboard {...result} onReset={onReset} appsToRestore={appsToRestore} />
      ) : !hasReset ? (
        <DeviceAction onResult={onResult} action={action} request={null} />
      ) : (
        <Disconnected onTryAgain={setHasReset} />
      )}
    </>
  );
};

export default Manager;
