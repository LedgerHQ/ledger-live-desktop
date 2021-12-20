import React, { useState, useCallback } from "react";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const Manager = () => {
  const [appsToRestore, setRestoreApps] = useState();
  const [result, setResult] = useState(null);
  const onReset = useCallback(apps => {
    setRestoreApps(apps);
    setResult(null);
  }, []);
  const onResult = useCallback(result => setResult(result), []);

  return (
    <div style={{ borderLeft: "solid lightgrey 1px", padding: "0px 40px" }}>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Dashboard {...result} onReset={onReset} appsToRestore={appsToRestore} />
      ) : (
        <DeviceAction onResult={onResult} action={action} request={null} />
      )}
    </div>
  );
};

export default Manager;
