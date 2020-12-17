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
  error: null,
  getNamesResult: null,
  isNanoPassLoading: true,
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

      if (state.getNamesResult || state.error) {
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
              isNanoPassLoading: false,
            }),
          err =>
            setState({
              ...state,
              error: err,
              isNanoPassLoading: false,
            }),
        );
    }, [device, opened, state]);

    return {
      ...appState,
      ...state,
    };
  };

  return {
    useHook,
    mapResult: r => ({
      entries: r.getNamesResult,
      error: r.error,
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
        <Password {...result} onUpdate={() => setResult()} />
      ) : (
        <DeviceAction onResult={setResult} action={action} request={{}} />
      )}
    </>
  );
};
export default Index;
