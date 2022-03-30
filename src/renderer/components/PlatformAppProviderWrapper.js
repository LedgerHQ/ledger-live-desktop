// @flow
import React from "react";
import { catalogProviderSelector } from "~/renderer/reducers/settings";
import { useSelector } from "react-redux";
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

  return (
    <RemoteLiveAppProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
      <LocalLiveAppProvider>
        <GlobalCatalogProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
          <RampCatalogProvider provider={provider} updateFrequency={AUTO_UPDATE_DEFAULT_DELAY}>
            {children}
          </RampCatalogProvider>
        </GlobalCatalogProvider>
      </LocalLiveAppProvider>
    </RemoteLiveAppProvider>
  );
}
