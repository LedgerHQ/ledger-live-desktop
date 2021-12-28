// @flow

import React, { useCallback, useState } from "react";
import Connect from "./Connect";
import MissingOrOutdatedSellApp from "./MissingOrOutdatedSellApp";
import Sell from "./Sell";
import type { DProps } from "~/renderer/screens/exchange";

const MaybeSell = ({ defaultCurrency, defaultAccount }: DProps) => {
  const [installedApps, setInstalledApps] = useState();

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.result;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );
  const exchangeApp = installedApps?.find(a => a.name === "Exchange");

  return !installedApps ? (
    <Connect setResult={onSetResult} />
  ) : !exchangeApp ? (
    <MissingOrOutdatedSellApp />
  ) : exchangeApp.outdated ? (
    <MissingOrOutdatedSellApp outdated />
  ) : (
    <Sell
      installedApps={installedApps}
      defaultCurrency={defaultCurrency}
      defaultAccount={defaultAccount}
    />
  );
};

export default MaybeSell;
