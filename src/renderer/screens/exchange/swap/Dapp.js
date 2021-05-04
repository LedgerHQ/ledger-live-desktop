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
    url: `https://iframe-dapp-browser-test.vercel.app/app/debug?t=3333`,
    name: "Debugger",
  },
  paraswap: {
    name: "paraswap",
    url: new URL(
      `https://iframe-dapp-browser-test.vercel.app/app/dapp-browser?url=https://paraswap-ui-ledger.herokuapp.com/?embed=true`,
    ),
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
