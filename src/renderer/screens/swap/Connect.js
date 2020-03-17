// @flow

import React from "react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import Card from "~/renderer/components/Box/Card";

const connectManagerExec = command("connectManager");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const Connect = ({ setResult }: { setResult: () => void }) => {
  return (
    <Card p={89} alignItems="center">
      <DeviceAction onResult={setResult} action={action} request={null} />
    </Card>
  );
};

export default Connect;
