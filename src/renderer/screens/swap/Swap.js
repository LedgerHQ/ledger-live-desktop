// @flow

import React, { useCallback, useEffect, useState } from "react";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import Landing from "~/renderer/screens/swap/Landing";
import Form from "~/renderer/screens/swap/Form";
import Connect from "~/renderer/screens/swap/Connect";
import MissingSwapApp from "~/renderer/screens/swap/MissingSwapApp";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/swap/types";

type MaybeProviders = ?(AvailableProvider[]);

const Swap = ({ setShowRateChanged }: { setShowRateChanged: boolean => void }) => {
  const [providers, setProviders] = useState<MaybeProviders>();
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [installedApps, setInstalledApps] = useState();

  useEffect(() => {
    async function fetchProviders() {
      const providers = await getProviders();
      setProviders(providers);
    }
    fetchProviders();
  }, [setProviders]);

  const onSetResult = useCallback(
    data => {
      if (!data) return;
      const { installed } = data.result;
      setInstalledApps(installed);
    },
    [setInstalledApps],
  );

  const showInstallSwap = installedApps && !installedApps.some(a => a.name === "Exchange");
  const onContinue = useCallback(() => {
    setShowLandingPage(false);
  }, [setShowLandingPage]);

  return showLandingPage ? (
    <Landing providers={providers} onContinue={onContinue} />
  ) : !installedApps ? (
    <Connect setResult={onSetResult} />
  ) : showInstallSwap ? (
    <MissingSwapApp />
  ) : (
    <Form
      providers={providers}
      installedApps={installedApps}
      setShowRateChanged={setShowRateChanged}
    />
  );
};

export default Swap;
