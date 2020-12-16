// @flow
import React, { useState, useEffect } from "react";
import type { RouterHistory, Match, Location } from "react-router-dom";
import { createAction as createAppAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { SyncSkipUnderPriority } from "@ledgerhq/live-common/lib/bridge/react";
import DeviceAction from "~/renderer/components/DeviceAction";
import { command } from "~/renderer/commands";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import Password from "./Password";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

const initialState = {
  getNamesError: null,
  getNamesResult: null,
};
const createAction = connectAppExec => {
  const useHook = (reduxDevice, request) => {
    const appState = createAppAction(connectAppExec).useHook(reduxDevice, {
      appName: "nanopass",
    });

    const { device, opened } = appState;

    const [state, setState] = useState(initialState);

    useEffect(() => {
      if (!opened || !device) {
        setState(initialState);
        return;
      }

      command("getNames")({
        deviceId: device.deviceId,
      })
        .toPromise()
        .then(
          result =>
            setState({
              ...state,
              getNamesResult: result,
            }),
          err =>
            setState({
              ...state,
              getNamesError: err,
            }),
        );
    }, [device, opened, state]);

    return {
      ...appState,
      ...state,
      isLoading: !state.getNamesResult,
    };
  };

  return {
    useHook,
    mapResult: r => ({
      names: r.getNamesResult,
      error: r.getNamesError,
    }),
  };
};

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : command("connectApp"));

// Props are passed from the <Route /> component in <Default />
const Index = ({ history, location, match }: Props) => {
  const [result, setResult] = useState(null);

  return (
    <>
      <SyncSkipUnderPriority priority={999} />
      {result ? (
        <Password {...result} />
      ) : (
        <DeviceAction
          onResult={setResult}
          action={action}
          request={{
            appName: "nanopass",
          }}
        />
      )}
    </>
  );
};
export default Index;
