// @flow

import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import type {
  CryptoCurrency,
  TokenCurrency,
  Account,
  AccountLike,
} from "@ledgerhq/live-common/lib/types";
import { hasAcceptedSwapKYCSelector, swapProvidersSelector } from "~/renderer/reducers/settings";
import { setSwapProviders } from "~/renderer/actions/settings";
import Landing from "~/renderer/screens/swap/Landing";
import Loading from "~/renderer/screens/swap/Loading";
import NotAvailable from "~/renderer/screens/swap/NotAvailable";
import Form from "~/renderer/screens/swap/Form";
import Connect from "~/renderer/screens/swap/Connect";
import MissingOrOutdatedSwapApp from "~/renderer/screens/swap/MissingOrOutdatedSwapApp";

type Props = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?AccountLike,
  defaultParentAccount?: ?Account,
};

const Swap = ({ defaultCurrency, defaultAccount, defaultParentAccount }: Props) => {
  const providers = useSelector(swapProvidersSelector);
  const hasAcceptedSwapKYC = useSelector(hasAcceptedSwapKYCSelector);

  const [hasUpToDateProviders, setHasUpToDateProviders] = useState(false);
  const [installedApps, setInstalledApps] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasAcceptedSwapKYC) {
      getProviders().then(maybeProviders => {
        dispatch(
          setSwapProviders(
            maybeProviders instanceof SwapNoAvailableProviders ? [] : maybeProviders,
          ),
        );
        setHasUpToDateProviders(true);
      });
    }
  }, [dispatch, hasAcceptedSwapKYC]);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.result;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );

  const exchangeApp = useMemo(() => installedApps?.find(a => a.name === "Exchange"), [
    installedApps,
  ]);

  return !hasAcceptedSwapKYC ? (
    <Landing />
  ) : !hasUpToDateProviders ? (
    <Loading />
  ) : !providers?.length ? (
    <NotAvailable />
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
