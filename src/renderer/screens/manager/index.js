// @flow
import React, { useState, useCallback } from "react";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import Dashboard from "~/renderer/screens/manager/Dashboard";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { useSetOverlays } from "~/renderer/components/ProductTour/hooks";

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

  useSetOverlays(!result, {
    selector: "#manager-device-action-wrapper",
    i18nKey: "productTour.flows.install.overlays.connect",
    config: { bottom: true },
  });

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Dashboard {...result} onReset={onReset} appsToRestore={appsToRestore} />
      ) : (
        <Box id={"manager-device-action-wrapper"} pb={4}>
          <DeviceAction onResult={onResult} action={action} request={null} />
        </Box>
      )}
    </>
  );
};

export default Manager;
