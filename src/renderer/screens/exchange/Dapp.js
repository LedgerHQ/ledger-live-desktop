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
  wyre: {
    name: "Wyre",
    url: new URL(`https://ledger-live-platform-apps.vercel.app/app/wyre`),
    // $FlowFixMe
    icon: require("../../images/platform/wyre.png").default,
  },
};

export default function ExchangeDapp({ match }: Props) {
  const history = useHistory();
  const { platform } = match.params;
  const manifest = manifests[platform];

  const handleClose = useCallback(() => history.push(`/exchange`), [history]);

  if (!manifest) {
    return null;
  }

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <WebPlatformPlayer manifest={manifest} onClose={handleClose} />
    </Card>
  );
}
