// @flow
import React, { useMemo } from "react";
import { PlatformAppProvider } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { catalogProviderSelector } from "~/renderer/reducers/settings";
import { useSelector } from "react-redux";
import { providers } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/providers";

type Props = {
  children: React$Node,
};

export function PlatformAppProviderWrapper({ children }: Props) {
  const provider = useSelector(catalogProviderSelector);

  const platformAppsServer = useMemo(() => {
    return providers.find(p => p.value === provider) || providers[0];
  }, [provider]);

  return (
    <PlatformAppProvider
      platformAppsServerURL={platformAppsServer.url}
      platformCatalogServerURL={platformAppsServer.catalogUrl}
    >
      {children}
    </PlatformAppProvider>
  );
}
