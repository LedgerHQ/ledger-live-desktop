// @flow
import invariant from "invariant";
import { concat, of, empty, interval } from "rxjs";
import { scan, debounce, debounceTime, catchError, switchMap, tap } from "rxjs/operators";
import { useEffect, useCallback, useState, useMemo } from "react";
import { log } from "@ledgerhq/logs";
import {
  getDerivationScheme,
  getDerivationModesForCurrency,
  runDerivationScheme,
} from "@ledgerhq/live-common/lib/derivation";
import type { AppAndVersion, ConnectAppEvent } from "~/internal/commands/connectApp";
import type { Account, CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { Device } from "~/renderer/reducers/devices";
import { command } from "~/renderer/commands";
import { useReplaySubject } from "./shared";
import type { Action } from "./shared";

type State = {|
  isLoading: boolean,
  requestQuitApp: boolean,
  requestOpenApp: ?string,
  requiresAppInstallation: ?{ appName: string },
  opened: boolean,
  appAndVersion: ?AppAndVersion,
  unresponsive: boolean,
  allowOpeningRequestedWording: ?string,
  allowOpeningGranted: boolean,
  device: ?Device,
  error: ?Error,
  derivation: ?{ address: string },
|};

export type AppState = {|
  ...State,
  onRetry: () => void,
  inWrongDeviceForAccount: ?{ accountName: string },
|};

export type AppRequest = {
  appName?: ?string,
  currency?: ?CryptoCurrency,
  account?: ?Account,
  tokenCurrency?: ?TokenCurrency,
};

export type AppResult = {|
  device: Device,
  appAndVersion: ?AppAndVersion,
|};

type AppAction = Action<AppRequest, AppState, AppResult>;

type Event =
  | { type: "error", error: Error }
  | { type: "deviceChange", device: ?Device }
  | ConnectAppEvent;

const mapResult = ({ opened, device, appAndVersion }: AppState): ?AppResult =>
  opened && device ? { device, appAndVersion } : null;

const getInitialState = (device?: ?Device): State => ({
  isLoading: !!device,
  requestQuitApp: false,
  requestOpenApp: null,
  unresponsive: false,
  requiresAppInstallation: null,
  allowOpeningRequestedWording: null,
  allowOpeningGranted: false,
  device: null,
  opened: false,
  appAndVersion: null,
  error: null,
  derivation: null,
});

const reducer = (state: State, e: Event): State => {
  switch (e.type) {
    case "unresponsiveDevice":
      return {
        ...state,
        unresponsive: true,
      };

    case "deviceChange":
      return {
        ...getInitialState(e.device),
        device: e.device,
      };

    case "error":
      return {
        ...getInitialState(),
        error: e.error,
        isLoading: false,
      };

    case "ask-open-app":
      return {
        ...state,
        unresponsive: false,
        requestOpenApp: e.appName,
      };

    case "ask-quit-app":
      return {
        ...state,
        unresponsive: false,
        requestQuitApp: true,
      };

    case "device-permission-requested":
      return {
        ...state,
        unresponsive: false,
        allowOpeningRequestedWording: e.wording,
      };

    case "device-permission-granted":
      return {
        ...state,
        unresponsive: false,
        allowOpeningRequestedWording: null,
        allowOpeningGranted: true,
      };

    case "app-not-installed":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        allowOpeningRequestedWording: null,
        requiresAppInstallation: { appName: e.appName },
      };

    case "opened":
      return {
        ...state,
        isLoading: false,
        unresponsive: false,
        opened: true,
        appAndVersion: e.app,
        derivation: e.derivation,
      };
  }
  return state;
};

const connectApp = (device, params) =>
  concat(
    of({ type: "deviceChange", device }),
    !device
      ? empty()
      : command("connectApp")({
          devicePath: device.path,
          ...params,
        }).pipe(catchError((error: Error) => of({ type: "error", error }))),
  );

const useHook = (device: ?Device, appRequest: AppRequest): AppState => {
  // repair modal will interrupt everything and be rendered instead of the background content
  const [state, setState] = useState(() => getInitialState(device));
  const [resetIndex, setResetIndex] = useState(0);
  const deviceSubject = useReplaySubject(device);

  const params = useMemo(
    () => inferCommandParams(appRequest),
    // for now i don't have better
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      appRequest.appName,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      appRequest.account && appRequest.account.id,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      appRequest.currency && appRequest.currency.id,
    ],
  );

  useEffect(() => {
    const sub = deviceSubject
      .pipe(
        // debounce a bit the connect/disconnect event that we don't need
        debounceTime(1000),
        // each time there is a device change, we pipe to the command
        switchMap(device => connectApp(device, params)),
        tap(e => log("actions-app-event", e.type, e)),
        // tap(e => console.log("connectApp event", e)),
        // we gather all events with a reducer into the UI state
        scan(reducer, getInitialState()),
        // tap(s => console.log("connectApp state", s)),
        // we debounce the UI state to not blink on the UI
        debounce(s => {
          if (s.allowOpeningRequestedWording || s.allowOpeningGranted) {
            // no debounce for allow event
            return empty();
          }
          // default debounce (to be tweak)
          return interval(1500);
        }),
      )
      // the state simply goes into a React state
      .subscribe(setState); // FIXME shouldn't we handle errors?! (is an error possible?)

    return () => {
      sub.unsubscribe();
    };
  }, [params, deviceSubject, resetIndex]);

  const onRetry = useCallback(() => {
    setResetIndex(currIndex => currIndex + 1);
  }, []);

  return {
    ...state,
    inWrongDeviceForAccount:
      state.derivation && appRequest.account
        ? state.derivation.address !== appRequest.account.freshAddress
          ? { accountName: getAccountName(appRequest.account) }
          : null
        : null,
    onRetry,
  };
};

function inferCommandParams(appRequest: AppRequest) {
  let derivationMode;
  let derivationPath;

  let appName = appRequest.appName;
  const account = appRequest.account;
  let currency = appRequest.currency;
  if (!currency && account) {
    currency = account.currency;
  }
  if (!appName && currency) {
    appName = currency.managerAppName;
  }

  invariant(appName, "appName or currency or account is missing");

  if (!currency) {
    return { appName };
  }

  if (account) {
    derivationMode = account.derivationMode;
    derivationPath = account.freshAddressPath;
  } else {
    const modes = getDerivationModesForCurrency(currency);
    derivationMode = modes[modes.length - 1];
    derivationPath = runDerivationScheme(
      getDerivationScheme({ currency, derivationMode }),
      currency,
    );
  }

  return {
    appName,
    requiresDerivation: {
      derivationMode,
      derivationPath,
      currencyId: currency.id,
    },
  };
}

export const action: AppAction = {
  useHook,
  mapResult,
};
