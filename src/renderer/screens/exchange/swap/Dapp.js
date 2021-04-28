// @flow
import React, { useCallback } from "react";
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

const manifests = {
  debug: {
    url: new URL(`http://localhost:3000/app/debug?t=1`),
    name: "Debugger",
  },
  paraswap: {
    name: "ParaSwap",
    url: new URL(
      `http://localhost:3000/app/dapp-browser?url=${encodeURIComponent(
        "https://paraswap-ui-ledger.herokuapp.com/?embed=true",
      )}`,
    ),
    // $FlowFixMe
    icon: require("../../../images/platform/paraswap.png").default,
  },
};

export default function SwapDapp({ match }: Props) {
  const history = useHistory();
  const { platform } = match.params;
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
