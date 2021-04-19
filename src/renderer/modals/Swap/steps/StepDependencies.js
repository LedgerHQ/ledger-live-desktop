// @flow
import React, { useEffect, useCallback, useMemo, useState } from "react";
import type { Exchange } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { isExchangeSupportedByApp } from "@ledgerhq/live-common/lib/exchange";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import MissingOrOutdatedApp from "~/renderer/screens/exchange/swap/MissingOrOutdatedApp";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/manager";
import { command } from "~/renderer/commands";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import DeviceAction from "~/renderer/components/DeviceAction";
const connectManagerExec = command("connectManager");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectManagerExec);

const StepDependencies = ({
  swap,
  openManager,
  onDependenciesChecked,
}: {
  swap: { exchange: Exchange },
  openManager: string => void,
  onDependenciesChecked: () => void,
}) => {
  const [installedApps, setInstalledApps] = useState();
  const { exchange } = swap;
  const { fromAccount, fromParentAccount, toAccount, toParentAccount } = exchange;
  const mainFromAccount = getMainAccount(fromAccount, fromParentAccount);
  const mainToAccount = getMainAccount(toAccount, toParentAccount);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.result;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );

  const getApp = useCallback(
    (account, parentAccount) => {
      const mainAccount = getMainAccount(account, parentAccount);
      return installedApps?.find(a => a.name === mainAccount.currency.managerAppName);
    },
    [installedApps],
  );

  const appSupportsExchange = useCallback(
    (app, mainAccount) => {
      if (!mainAccount || !mainAccount?.currency || !installedApps || !app) return false;
      return isExchangeSupportedByApp(mainAccount.currency.id, app.version);
    },
    [installedApps],
  );

  const fromApp = getApp(fromAccount, fromParentAccount);
  const toApp = getApp(toAccount, toParentAccount);
  const exchangeApp = useMemo(() => installedApps?.find(a => a.name === "Exchange"), [
    installedApps,
  ]);

  useEffect(() => {
    if (
      fromApp &&
      toApp &&
      exchangeApp?.updated &&
      appSupportsExchange(fromApp, mainFromAccount) &&
      appSupportsExchange(toApp, mainToAccount)
    ) {
      onDependenciesChecked();
    }
  }, [
    appSupportsExchange,
    exchangeApp,
    fromApp,
    mainFromAccount,
    mainToAccount,
    onDependenciesChecked,
    toApp,
  ]);

  return !installedApps ? (
    <DeviceAction onResult={onSetResult} action={action} request={null} />
  ) : !exchangeApp || !exchangeApp.updated ? (
    <MissingOrOutdatedApp
      onOpenManager={openManager}
      appName={"exchange"}
      outdated={(exchangeApp && !exchangeApp?.updated) || undefined}
    />
  ) : !fromApp || !fromApp.updated ? (
    <MissingOrOutdatedApp
      onOpenManager={openManager}
      appName={mainFromAccount.currency.managerAppName}
      outdated={(fromApp && !fromApp?.updated) || undefined}
    />
  ) : !toApp || !toApp.updated ? (
    <MissingOrOutdatedApp
      onOpenManager={openManager}
      appName={mainToAccount.currency.managerAppName}
      outdated={(toApp && !toApp?.updated) || undefined}
    />
  ) : null;
};

export default StepDependencies;
