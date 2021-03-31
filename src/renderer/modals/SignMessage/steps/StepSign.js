// @flow
import React from "react";
import { useDispatch } from "react-redux";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { StepProps } from "../types";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/signMessage";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import { command } from "~/renderer/commands";
import { closeModal } from "~/renderer/actions/modals";

const connectAppExec = command("connectApp");
const signMessageExec = command("signMessage");
const action = createAction(
  getEnv("MOCK") ? mockedEventEmitter : connectAppExec,
  getEnv("MOCK") ? mockedEventEmitter : signMessageExec,
);

export default function StepSign({
  account,
  message,
  onConfirmationHandler,
  onFailHandler,
}: StepProps) {
  const dispatch = useDispatch();

  return (
    <DeviceAction
      action={action}
      request={{
        account,
        message: message,
      }}
      onResult={result => {
        dispatch(closeModal("MODAL_SIGN_MESSAGE"));
        if (result.error) {
          onFailHandler(result.error);
        } else if (result.signature) {
          onConfirmationHandler(result.signature);
        }
      }}
    />
  );
}
