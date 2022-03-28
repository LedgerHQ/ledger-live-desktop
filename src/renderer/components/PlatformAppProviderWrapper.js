// @flow
import React, { useMemo } from "react";
import { PlatformAppProvider } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { catalogProviderSelector } from "~/renderer/reducers/settings";
import { useSelector } from "react-redux";
import { providers } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/providers";
import { RemoteLiveAppProvider } from "@ledgerhq/live-common/lib/platform/providers/RemoteLiveAppProvider";
import { LocalLiveAppProvider } from "@ledgerhq/live-common/lib/platform/providers/LocalLiveAppProvider";
import { GlobalCatalogProvider } from "@ledgerhq/live-common/lib/platform/providers/GlobalCatalogProvider";
import { RampCatalogProvider } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";

type Props = {
  children: React$Node,
};

const AUTO_UPDATE_DEFAULT_DELAY = 1800 * 1000; // 1800 seconds

export function PlatformAppProviderWrapper({ children }: Props) {
  const provider = useSelector(catalogProviderSelector);

  const platformAppsServer = useMemo(() => {
    return providers.find(p => p.value === provider) || providers[0];
  }, [provider]);

  return (
    <RemoteLiveAppProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
      <LocalLiveAppProvider>
        <GlobalCatalogProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
          <RampCatalogProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
            <PlatformAppProvider platformAppsServerURL={platformAppsServer.url}>
              {children}
            </PlatformAppProvider>
          </RampCatalogProvider>
        </GlobalCatalogProvider>
      </LocalLiveAppProvider>
    </RemoteLiveAppProvider>
  );
}
