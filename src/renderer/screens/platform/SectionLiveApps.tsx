import React, { useCallback, useMemo, useState } from "react";
import { Flex } from "@ledgerhq/react-ui";
import { AppMetadata } from "@ledgerhq/live-common/lib/platform/types";
import { useTranslation } from "react-i18next";
import { keyBy, sortBy } from "lodash";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import DropdownPicker, { Option } from "~/renderer/components/DropdownPicker";

type Props = SectionBaseProps;

type CategoriesIdsAndNetworksIds = { supercategories: string[]; networksIds: string[] };

const getInitialOptions = (possibilities: { value: string; label: string }[]): Option[] => {
  return [
    ...possibilities.map(p => ({
      ...p,
      checked: true,
    })),
  ];
};

const getAppMetadataNetworks = (appMetadata: AppMetadata): string[] => {
  return appMetadata.networks || [];
};

const getAppMetadataSuperCategory = (appMetadata: AppMetadata): string => {
  return appMetadata.supercategory;
};

const getEnabledOptionsValues = (options: Option[]): string[] => {
  return options.filter(o => o.checked).map(o => o.value);
};

const SectionLiveApps: React.FC<SectionBaseProps> = ({
  manifests,
  catalogMetadata,
  handleClick,
}: Props) => {
  const { t } = useTranslation();
  const { appsMetadata = [] } = catalogMetadata || {};

  const appsMetadataMappedById = useMemo(() => keyBy(appsMetadata, "id"), [appsMetadata]);

  const { supercategories, networks } = useMemo(() => {
    const reducer = (
      {
        supercategories: accSupercategories = [],
        networksIds: accNetworksIds = [],
      }: CategoriesIdsAndNetworksIds,
      appMetadata: AppMetadata,
    ): { supercategories: string[]; networksIds: string[] } => {
      const supercategory = getAppMetadataSuperCategory(appMetadata);
      const networks = getAppMetadataNetworks(appMetadata);
      const pushIfNotIncluded = (acc: string[] = [], val: string) => {
        return acc.includes(val) ? acc : [...acc, val];
      };
      return {
        networksIds: networks.reduce(pushIfNotIncluded, accNetworksIds),
        supercategories: accSupercategories.includes(supercategory)
          ? accSupercategories
          : [...accSupercategories, supercategory],
      };
    };
    const { supercategories, networksIds }: CategoriesIdsAndNetworksIds = appsMetadata.reduce(
      reducer,
      {
        supercategories: [],
        networksIds: [],
      },
    );
    return {
      supercategories: sortBy(
        supercategories.map(categoryId => ({
          value: categoryId,
          label: t(`platform.catalog.category.${categoryId}`, categoryId),
        })),
        "label",
      ),
      networks: [
        { value: "none", label: t("platform.catalog.noNetwork") },
        ...sortBy(
          networksIds.map(networkId => ({
            value: networkId,
            label: getCryptoCurrencyById(networkId)?.name || networkId,
          })),
          "label",
        ),
      ],
    };
  }, [appsMetadata, t]);

  const [networksOptions, setNetworksOptions] = useState(getInitialOptions(networks));
  const [categoriesOptions, setCategoriesOptions] = useState(getInitialOptions(supercategories));

  const isAllOnNetworks = networksOptions.some(opt => opt.checked);
  const isAllIndeterminateNetworks =
    networksOptions.some(opt => opt.checked) && networksOptions.some(opt => !opt.checked);
  const isAllOnCategories = categoriesOptions.some(opt => opt.checked);
  const isAllIndeterminateCategories =
    categoriesOptions.some(opt => opt.checked) && categoriesOptions.some(opt => !opt.checked);

  const handleAllPressedNetworks = useCallback(() => {
    setNetworksOptions(networksOptions.map(opt => ({ ...opt, checked: !isAllOnNetworks })));
  }, [networksOptions, setNetworksOptions, isAllOnNetworks]);
  const handleAllPressedCategories = useCallback(() => {
    setCategoriesOptions(categoriesOptions.map(opt => ({ ...opt, checked: !isAllOnCategories })));
  }, [categoriesOptions, setCategoriesOptions, isAllOnCategories]);

  const right = (
    <Flex flexDirection="row" zIndex={1}>
      <DropdownPicker
        isAllOn={isAllOnNetworks}
        isAllIndeterminate={isAllIndeterminateNetworks}
        options={networksOptions}
        onChange={setNetworksOptions}
        onPressAll={handleAllPressedNetworks}
        label={t("platform.catalog.networks")}
      />
      <DropdownPicker
        isAllOn={isAllOnCategories}
        isAllIndeterminate={isAllIndeterminateCategories}
        options={categoriesOptions}
        onChange={setCategoriesOptions}
        onPressAll={handleAllPressedCategories}
        label={t("platform.catalog.categories")}
      />
    </Flex>
  );

  const enabledNetworks = getEnabledOptionsValues(networksOptions);
  const enabledCategories = getEnabledOptionsValues(categoriesOptions);
  const filteredManifests = useMemo(() => {
    return manifests.filter(manifest => {
      const appMetadata = appsMetadataMappedById[manifest.id];
      const networks = getAppMetadataNetworks(appMetadata);
      const supercategory = getAppMetadataSuperCategory(appMetadata);
      const networksCondition =
        networks.some(n => enabledNetworks.includes(n)) ||
        (networks.length === 0 && enabledNetworks.includes("none"));
      const categoriesCondition = enabledCategories.includes(supercategory);
      return networksCondition && categoriesCondition;
    });
  }, [appsMetadataMappedById, enabledNetworks, enabledCategories, manifests]);

  const content = useMemo(
    () =>
      filteredManifests.map(manifest => (
        <AppRow
          key={manifest.id}
          id={`platform-catalog-app-${manifest.id}`}
          manifest={manifest}
          appMetadata={appsMetadataMappedById[manifest.id]}
          onClick={() => handleClick(manifest)}
        />
      )),
    [filteredManifests, handleClick, appsMetadataMappedById],
  );

  return (
    <Flex flexDirection="column">
      <SectionHeader title={t("platform.catalog.liveApps")} right={right} />
      <Flex flexDirection="column" rowGap="12px">
        {content}
      </Flex>
    </Flex>
  );
};

export default SectionLiveApps;
