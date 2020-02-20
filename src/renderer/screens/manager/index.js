// @flow
import React, { useState, useCallback } from "react";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import SyncSkipUnderPriority from "~/renderer/components/SyncSkipUnderPriority";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/manager";

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
