// @flow

import React, { useCallback, useEffect, useState } from "react";
import { getProviders } from "@ledgerhq/live-common/lib/swap";
import Landing from "~/renderer/screens/swap/Landing";
import Form from "~/renderer/screens/swap/Form";
import Connect from "~/renderer/screens/swap/Connect";

const Swap = () => {
  const [providers, setProviders] = useState(null);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [skipDeviceAction, setSkipDeviceAction] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      const providers = await getProviders();
      setProviders(providers);
    }
    fetchProviders();
  }, [setProviders]);

  const showDeviceAction = !result && !skipDeviceAction;
  const showInstallSwap = result && !result.installedApps.includes("swap"); // FIXME Or whatever name this app has

  const onContinue = useCallback(() => {
    setShowLandingPage(false);
  }, [setShowLandingPage]);

  return showLandingPage ? (
    <Landing providers={providers} onContinue={onContinue} />
  ) : showDeviceAction ? (
    <Connect setResult={setResult} setSkipDeviceAction={setSkipDeviceAction} />
  ) : showInstallSwap ? (
    <div> [Install the missing app illustration] </div>
  ) : (
    <Form providers={providers} />
  );
};

export default Swap;
