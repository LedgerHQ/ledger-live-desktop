// @flow
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useTheme from "~/renderer/hooks/useTheme";

import { Card } from "~/renderer/components/Box";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";
import { useRemoteLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/RemoteLiveAppProvider";
import { useLocalLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/LocalLiveAppProvider";
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
  const localManifest = useLocalLiveAppManifest(appId);
  const remoteManifest = useRemoteLiveAppManifest(appId);

  const manifest = localManifest || remoteManifest;

  console.log(appId, manifest);

  const handleClose = useCallback(() => history.push(`/platform`), [history]);
  const themeType = useTheme("colors.palette.type");
  const lang = useSelector(languageSelector);
  const params = {
    theme: themeType,
    lang,
    ...urlParams,
  };

  // TODO for next urlscheme evolutions:
  // - check if local settings allow to launch an app from this branch, else display an error
  // - check if the app is available in store, else display a loader if apps are getting fetched from remote, else display an error stating that the app doesn't exist

  return (
    <Card grow style={{ overflow: "hidden" }}>
      {manifest ? (
        <WebPlatformPlayer manifest={manifest} onClose={handleClose} inputs={params} />
      ) : null}
    </Card>
  );
}
