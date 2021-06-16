// @flow
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useAppManifest } from "@ledgerhq/live-common/lib/platform/CatalogProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
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

export default function PlatformApp({ match }: Props) {
  const history = useHistory();
  const { platform } = match.params;
  const manifest = useAppManifest(platform);

  const handleClose = useCallback(() => history.push(`/platform`), [history]);

  if (!manifest) {
    return "oops no manifest";
  }

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <TrackPage category="Platform" name="App" />
      <WebPlatformPlayer manifest={manifest} onClose={handleClose} />
    </Card>
  );
}
