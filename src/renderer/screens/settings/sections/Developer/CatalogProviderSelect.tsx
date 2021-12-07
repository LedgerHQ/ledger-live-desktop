import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCatalogProvider } from "~/renderer/actions/settings";
import { catalogProviderSelector } from "~/renderer/reducers/settings";
import { SelectInput } from "@ledgerhq/react-ui";
import Track from "~/renderer/analytics/Track";
import { providers } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/providers";

type ArrayElement<
  ArrayType extends readonly unknown[]
> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const CatalogProviderSelect = () => {
  const dispatch = useDispatch();
  const provider = useSelector(catalogProviderSelector);

  const handleChangeProvider = useCallback(
    (option: ArrayElement<typeof providers> | null) => {
      if (option) {
        dispatch(setCatalogProvider(option.value));
      }
    },
    [dispatch],
  );

  const currentProvider = providers.find(option => option.value === provider);

  return (
    <>
      <Track onUpdate event="CatalogProviderSelect" currentProvider={provider} />
      <SelectInput
        styles={{ input: provided => ({ ...provided, width: "210px" }) }}
        onChange={handleChangeProvider}
        value={currentProvider}
        options={providers}
      />
    </>
  );
};

export default CatalogProviderSelect;
