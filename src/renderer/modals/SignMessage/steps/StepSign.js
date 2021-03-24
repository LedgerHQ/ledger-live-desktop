// @flow
import React from "react";
import type { StepProps } from "../types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/signMessage";
import connectApp from "@ledgerhq/live-common/lib/hw/connectApp";

const action = createAction(connectApp);

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
