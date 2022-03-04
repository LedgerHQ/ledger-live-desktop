// @flow
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import useTheme from "~/renderer/hooks/useTheme";

import TrackPage from "~/renderer/analytics/TrackPage";
import { Card } from "~/renderer/components/Box";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";
import { useLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/LiveAppProvider";
import { languageSelector } from "~/renderer/reducers/settings";
import { useSelector } from "react-redux";

type Props = {
  match: {
    params: {
      appId: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
};

export default function PlatformApp({ match }: Props) {
  const history = useHistory();
  const { state: urlParams } = useLocation();
  const { appId } = match.params;
  const manifest = useLiveAppManifest(appId);

  console.log(appId, manifest);

  const handleClose = useCallback(() => history.push(`/platform`), [history]);
  const themeType = useTheme("colors.palette.type");
  const lang = useSelector(languageSelector);

  // TODO for next urlscheme evolutions:
  // - check if local settings allow to launch an app from this branch, else display an error
  // - check if the app is available in store, else display a loader if apps are getting fetched from remote, else display an error stating that the app doesn't exist

  return (
    <Card grow style={{ overflow: "hidden" }}>
      <TrackPage category="Platform" name="App" appId={appId} />
      {manifest ? (
        <WebPlatformPlayer
          manifest={manifest}
          onClose={handleClose}
          inputs={{
            theme: themeType,
            lang,
            ...urlParams,
          }}
        />
      ) : null}
    </Card>
  );
}
