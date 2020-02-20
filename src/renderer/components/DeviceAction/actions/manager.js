// @flow
import { concat, of, empty, interval } from "rxjs";
import { scan, debounce, debounceTime, catchError, switchMap, tap } from "rxjs/operators";
import { useEffect, useCallback, useState } from "react";
import { log } from "@ledgerhq/logs";
import type { DeviceInfo } from "@ledgerhq/live-common/lib/types/manager";
import type { ListAppsResult } from "@ledgerhq/live-common/lib/apps/types";
import manager from "@ledgerhq/live-common/lib/manager";
import type { ConnectManagerEvent } from "~/internal/commands/connectManager";
import type { Device } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import logger from "~/logger";
import { useReplaySubject } from "./shared";
import type { Action } from "./shared";

type State = {|
  isLoading: boolean,
  requestQuitApp: boolean,
  unresponsive: boolean,
  allowManagerRequestedWording: ?string,
  allowManagerGranted: boolean,
  device: ?Device,
  deviceInfo: ?DeviceInfo,
  result: ?ListAppsResult,
  error: ?Error,
|};

type ManagerState = {|
  ...State,
  repairModalOpened: ?{ auto: boolean },
  onRetry: () => void,
  onAutoRepair: () => void,
  onRepairModal: boolean => void,
  closeRepairModal: () => void,
|};

type Result = {|
  device: Device,
  deviceInfo: DeviceInfo,
  result: ?ListAppsResult,
|};

type ManagerAction = Action<void, ManagerState, Result>;

type Event =
  | ConnectManagerEvent
  | { type: "error", error: Error }
  | { type: "deviceChange", device: ?Device };

const mapResult = ({ deviceInfo, device, result }): ?Result =>
  deviceInfo && device
    ? {
        device,
        deviceInfo,
        result,
      }
    : null;

const getInitialState = (device?: ?Device): State => ({
  isLoading: !!device,
  requestQuitApp: false,
  unresponsive: false,
  allowManagerRequestedWording: null,
  allowManagerGranted: false,
  device,
  deviceInfo: null,
  result: null,
  error: null,
});

const reducer = (state: State, e: Event): State => {
  switch (e.type) {
    case "unresponsiveDevice":
      return {
        ...state,
        unresponsive: true,
      };

    case "deviceChange":
      return getInitialState(e.device);

    case "error":
      return {
        ...getInitialState(state.device),
        error: e.error,
        isLoading: false,
      };

    case "appDetected":
      return {
        ...state,
        unresponsive: false,
        requestQuitApp: true,
      };

    case "osu":
    case "bootloader":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        requestQuitApp: false,
        deviceInfo: e.deviceInfo,
      };

    case "listingApps":
      return {
        ...state,
        requestQuitApp: false,
        unresponsive: false,
        deviceInfo: e.deviceInfo,
      };

    case "device-permission-requested":
      return {
        ...state,
        unresponsive: false,
        allowManagerRequestedWording: e.wording,
      };

    case "device-permission-granted":
      return {
        ...state,
        unresponsive: false,
        allowManagerRequestedWording: null,
        allowManagerGranted: true,
      };

    case "result":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        result: e.result,
      };
  }
  return state;
};

const connectManager = device =>
  concat(
    of({ type: "deviceChange", device }),
    !device
      ? empty()
      : command("connectManager")({ devicePath: device.path }).pipe(
          catchError((error: Error) => of({ type: "error", error })),
        ),
  );

const useHook = (device: ?Device): ManagerState => {
  // repair modal will interrupt everything and be rendered instead of the background content
  const [repairModalOpened, setRepairModalOpened] = useState(null);
  const [state, setState] = useState(() => getInitialState(device));
  const [resetIndex, setResetIndex] = useState(0);
  const deviceSubject = useReplaySubject(device);

  useEffect(() => {
    if (repairModalOpened) return;

    const sub = deviceSubject
      .pipe(
        // debounce a bit the connect/disconnect event that we don't need
        debounceTime(1000),
        // each time there is a device change, we pipe to the command
        switchMap(connectManager),
        tap(e => log("actions-manager-event", e.type, e)),
        // tap(e => console.log("connectManager event", e)),
        // we gather all events with a reducer into the UI state
        scan(reducer, getInitialState()),
        // tap(s => console.log("connectManager state", s)),
        // we debounce the UI state to not blink on the UI
        debounce(s => {
          if (s.allowManagerRequestedWording || s.allowManagerGranted) {
            // no debounce for allow manager
            return empty();
          }
          // default debounce (to be tweak)
          return interval(1500);
        }),
      )
      // the state simply goes into a React state
      .subscribe(setState);

    return () => {
      sub.unsubscribe();
    };
  }, [deviceSubject, resetIndex, repairModalOpened]);

  const { deviceInfo } = state;
  useEffect(() => {
    if (!deviceInfo) return;
    // Preload latest firmware in parallel
    manager.getLatestFirmwareForDevice(deviceInfo).catch((e: Error) => {
      logger.warn(e);
    });
  }, [deviceInfo]);

  const onRepairModal = useCallback(open => {
    setRepairModalOpened(open ? { auto: false } : null);
  }, []);

  const closeRepairModal = useCallback(() => {
    setRepairModalOpened(null);
  }, []);

  const onRetry = useCallback(() => {
    setResetIndex(currIndex => currIndex + 1);
    setState(s => getInitialState(s.device));
  }, []);

  const onAutoRepair = useCallback(() => {
    setRepairModalOpened({ auto: true });
  }, []);

  return {
    ...state,
    repairModalOpened,
    onRetry,
    onAutoRepair,
    closeRepairModal,
    onRepairModal,
  };
};

export const action: ManagerAction = {
  useHook,
  mapResult,
};
