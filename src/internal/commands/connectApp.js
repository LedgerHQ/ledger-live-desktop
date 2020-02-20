// @flow

import { Observable, concat, from, of, throwError, defer } from "rxjs";
import { concatMap, map, catchError, delay } from "rxjs/operators";
import {
  TransportStatusError,
  FirmwareOrAppUpdateRequired,
  UserRefusedOnDevice,
  BtcUnmatchedApp,
} from "@ledgerhq/errors";
import { withDevice } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import getAppAndVersion from "@ledgerhq/live-common/lib/hw/getAppAndVersion";
import getAddress from "@ledgerhq/live-common/lib/hw/getAddress";
import openApp from "@ledgerhq/live-common/lib/hw/openApp";
import type { DerivationMode } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";

export type RequiresDerivation = {|
  currencyId: string,
  derivationPath: string,
  derivationMode: DerivationMode,
|};

type Input = {
  devicePath: string,
  appName: string,
  requiresDerivation?: RequiresDerivation,
};

export type AppAndVersion = {
  name: string,
  version: string,
  flags: number,
};

export type ConnectAppEvent =
  | { type: "unresponsiveDevice" }
  | { type: "device-permission-requested", wording: string }
  | { type: "device-permission-granted" }
  | { type: "app-not-installed", appName: string }
  | { type: "ask-quit-app" }
  | { type: "ask-open-app", appName: string }
  | { type: "opened", app?: AppAndVersion, derivation?: { address: string } };

const dashboardNames = ["BOLOS", "OLOS\u0000"];

const openAppFromDashboard = (transport, appName): Observable<ConnectAppEvent> =>
  !getEnv("EXPERIMENTAL_DEVICE_FLOW")
    ? of({ type: "ask-open-app", appName })
    : concat(
        // TODO optim: the requested should happen a better in a deferred way because openApp might error straightaway instead
        of({ type: "device-permission-requested", wording: appName }),
        defer(() => from(openApp(transport, appName))).pipe(
          concatMap(() => of({ type: "device-permission-granted" })),
          catchError(e => {
            if (e && e instanceof TransportStatusError) {
              switch (e.statusCode) {
                case 0x6984:
                  return of({ type: "app-not-installed", appName });
                case 0x6985:
                  return throwError(new UserRefusedOnDevice());
              }
            }
            return throwError(e);
          }),
        ),
      );

const derivationLogic = (
  transport,
  {
    requiresDerivation,
    appAndVersion,
    appName,
  }: {
    requiresDerivation: RequiresDerivation,
    appAndVersion?: AppAndVersion,
    appName: string,
  },
): Observable<ConnectAppEvent> =>
  defer(() =>
    from(
      getAddress(transport, {
        currency: getCryptoCurrencyById(requiresDerivation.currencyId),
        path: requiresDerivation.derivationPath,
        derivationMode: requiresDerivation.derivationMode,
      }),
    ),
  ).pipe(
    map(({ address }) => ({
      type: "opened",
      appAndVersion,
      derivation: { address },
    })),
    catchError(e => {
      if (!e) return throwError(e);
      if (e instanceof BtcUnmatchedApp) {
        return of({ type: "ask-open-app", appName });
      }

      if (e instanceof TransportStatusError) {
        switch (e.statusCode) {
          case 0x6982:
          case 0x6700:
            return of({ type: "ask-open-app", appName });

          case 0x6f04: // FW-90. app was locked...
          case 0x6faa: // FW-90. app bricked, a reboot fixes it.
          case 0x6d00: // this is likely because it's the wrong app (LNS 1.3.1)
            return of({ type: "ask-quit-app" });
        }
      }
      return throwError(e);
    }),
  );

const cmd = ({ devicePath, appName, requiresDerivation }: Input): Observable<ConnectAppEvent> =>
  withDevice(devicePath)(transport =>
    Observable.create(o => {
      const timeoutSub = of({ type: "unresponsiveDevice" })
        .pipe(delay(1000))
        .subscribe(e => o.next(e));

      const sub = defer(() => from(getAppAndVersion(transport)))
        .pipe(
          concatMap(appAndVersion => {
            timeoutSub.unsubscribe();

            if (dashboardNames.includes(appAndVersion.name)) {
              // we're in dashboard
              return openAppFromDashboard(transport, appName);
            }

            if (appAndVersion.name !== appName) {
              return of({ type: "ask-quit-app" });
            }

            if (requiresDerivation) {
              return derivationLogic(transport, { requiresDerivation, appAndVersion, appName });
            } else {
              return of({ type: "opened", appAndVersion });
            }
          }),
          catchError((e: Error) => {
            if (
              e &&
              e instanceof TransportStatusError &&
              (e.statusCode === 0x6e00 || // in 1.3.1 dashboard
                e.statusCode === 0x6d00) // in 1.3.1 and bitcoin app
            ) {
              // fallback on "old way" because device does not support getAppAndVersion
              if (!requiresDerivation) {
                // if there is no derivation, there is nothing we can do to check an app (e.g. requiring non coin app)
                return throwError(new FirmwareOrAppUpdateRequired());
              }
              return derivationLogic(transport, { requiresDerivation, appName });
            }
            return throwError(e);
          }),
        )
        .subscribe(o);

      return () => {
        timeoutSub.unsubscribe();
        sub.unsubscribe();
      };
    }),
  );

export default cmd;
