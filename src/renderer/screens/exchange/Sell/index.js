// @flow

import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import { swapProvidersSelector } from "~/renderer/reducers/settings";
import type { CryptoCurrency, TokenCurrency, Account } from "@ledgerhq/live-common/lib/types";
import Connect from "~/renderer/screens/exchange/swap/Connect";
import MissingOrOutdatedSwapApp from "~/renderer/screens/exchange/swap/MissingOrOutdatedSwapApp";
import { setSwapProviders } from "~/renderer/actions/settings";
import Sell from "./Sell";

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const MaybeSell = ({ defaultCurrency, defaultAccount }: Props) => {
  const providers = useSelector(swapProvidersSelector);
  const [installedApps, setInstalledApps] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (providers === undefined) {
      // NB We only fetch in case the init.js fetch failed and we have nothing.
      getProviders().then(providers => dispatch(setSwapProviders(providers)));
    }
  }, [dispatch, providers]);

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
    <MissingOrOutdatedSwapApp />
  ) : exchangeApp.outdated ? (
    <MissingOrOutdatedSwapApp outdated />
  ) : (
    <Sell
      providers={providers}
      installedApps={installedApps}
      defaultCurrency={defaultCurrency}
      defaultAccount={defaultAccount}
    />
  );
};

export default MaybeSell;
