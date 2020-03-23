// @flow
import React, { useState, useCallback } from "react";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";

const connectManagerExec = command("connectManager");
const action = createAction(connectManagerExec);

const Manager = () => {
  const [result, setResult] = useState(null);
  const onReset = useCallback(() => setResult(null), []);

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Dashboard {...result} onReset={onReset} />
      ) : (
        <DeviceAction onResult={setResult} action={action} request={null} />
      )}
    </>
  );
};

export default Manager;
