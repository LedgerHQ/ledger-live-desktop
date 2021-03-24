// @flow
import React from "react";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { StepProps } from "../types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/signMessage";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { command } from "~/renderer/commands";

const connectAppExec = command("connectApp");
const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

export default function StepSign({
  account,
  message,
  onConfirmationHandler,
  onFailHandler,
}: StepProps) {
  return (
    <DeviceAction
      action={action}
      request={{
        account,
        message: message,
      }}
      onResult={result => {
        if (result.error) {
          onFailHandler(result.error);
        } else if (result.signature) {
          onConfirmationHandler(result.signature);
        }
      }}
    />
  );
}
