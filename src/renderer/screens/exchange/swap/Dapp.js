// @flow
import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { Card } from "~/renderer/components/Box";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";

type Props = {
  match: {
    params: {
      platform: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
};

const useManifests = () => {
  const allManifests = useMemo(() => {
    const paraswapUrl = new URL(`https://iframe-dapp-browser-test.vercel.app/app/dapp-browser`);
    paraswapUrl.searchParams.set("url", "https://paraswap-dapp-pr-851.herokuapp.com/?embed=true");
    paraswapUrl.searchParams.set("nanoApp", "Paraswap");
    paraswapUrl.searchParams.set("dappName", "paraswap");

    const manifests = {
      debug: {
        url: new URL(`https://iframe-dapp-browser-test.vercel.app/app/debug`),
        name: "Debugger",
      },
      paraswap: {
        name: "ParaSwap",
        url: paraswapUrl,
        // $FlowFixMe
        icon: require("../../../images/platform/paraswap.png").default,
      },
    };

    return manifests;
  }, []);

  return allManifests;
};

export default function SwapDapp({ match }: Props) {
  const history = useHistory();
  const { platform } = match.params;
  const manifests = useManifests();
  const manifest = manifests[platform];

  const handleClose = useCallback(() => history.push(`/swap`), [history]);

  if (!manifest) {
    return null;
  }

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <WebPlatformPlayer manifest={manifest} onClose={handleClose} />
    </Card>
  );
}
