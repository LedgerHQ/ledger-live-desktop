// @flow

import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import { swapProvidersSelector } from "~/renderer/reducers/application";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import Landing from "~/renderer/screens/swap/Landing";
import Form from "~/renderer/screens/swap/Form";
import Connect from "~/renderer/screens/swap/Connect";
import MissingOrOutdatedSwapApp from "~/renderer/screens/swap/MissingOrOutdatedSwapApp";
import { setSwapProviders } from "~/renderer/actions/application";

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?AccountLike,
  defaultParentAccount?: ?Account,
};

const Swap = ({ defaultCurrency, defaultAccount, defaultParentAccount }: Props) => {
  const providers = useSelector(swapProvidersSelector);
  const [error, setProvidersError] = useState();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [installedApps, setInstalledApps] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (providers === undefined && !error) {
      // NB We only fetch in case the init.js fetch failed and we have nothing.
      getProviders().then(maybeProviders => {
        if (maybeProviders instanceof SwapNoAvailableProviders) {
          setProvidersError(maybeProviders);
        } else {
          dispatch(setSwapProviders(providers));
        }
      });
    }
  }, [dispatch, error, providers]);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.result;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );
  const exchangeApp = installedApps?.find(a => a.name === "Exchange");

  const onContinue = useCallback(() => {
    setShowLandingPage(false);
  }, [setShowLandingPage]);

  return showLandingPage ? (
    <Landing providers={error ? [] : providers} onContinue={onContinue} />
  ) : !installedApps ? (
    <Connect setResult={onSetResult} />
  ) : !exchangeApp ? (
    <MissingOrOutdatedSwapApp />
  ) : !exchangeApp.updated ? (
    <MissingOrOutdatedSwapApp outdated />
  ) : (
    <Form
      providers={providers}
      installedApps={installedApps}
      defaultCurrency={defaultCurrency}
      defaultAccount={defaultAccount}
      defaultParentAccount={defaultParentAccount}
    />
  );
};

export default Swap;
