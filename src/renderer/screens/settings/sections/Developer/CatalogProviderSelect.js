//  @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCatalogProvider } from "~/renderer/actions/settings";
import { catalogProviderSelector } from "~/renderer/reducers/settings";
import Select from "~/renderer/components/Select";
import Track from "~/renderer/analytics/Track";
import { providers } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/providers";

const CatalogProviderSelect = () => {
  const dispatch = useDispatch();
  const provider = useSelector(catalogProviderSelector);

  const handleChangeProvider = useCallback(
    ({ value: providerKey }: { value: string }) => {
      dispatch(setCatalogProvider(providerKey));
    },
    [dispatch],
  );

  const currentProvider = providers.find(option => option.value === provider);

  return (
    <>
      <Track onUpdate event="CatalogProviderSelect" currentProvider={provider} />
      <Select
        small
        minWidth={260}
        isSearchable={false}
        onChange={handleChangeProvider}
        value={currentProvider}
        options={providers}
      />
    </>
  );
};

export default CatalogProviderSelect;
