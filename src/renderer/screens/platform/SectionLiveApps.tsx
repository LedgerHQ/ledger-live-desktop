import React, { useCallback, useMemo, useState } from "react";
import { Flex } from "@ledgerhq/react-ui";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { useTranslation } from "react-i18next";
import { sortBy } from "lodash";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";
import DropdownPicker, { Option } from "~/renderer/components/DropdownPicker";

type Props = SectionBaseProps;

type CategoriesIdsAndNetworksIds = { categoriesIds: string[]; networksIds: string[] };

const getInitialOptions = (possibilities: { value: string; label: string }[]): Option[] => {
  return [
    ...possibilities.map(p => ({
      ...p,
      checked: true,
    })),
  ];
};

const getManifestNetworks = (manifest: AppManifest): string[] => {
  const { params = {} } = manifest;
  const networks: { currency: string }[] = params.networks || [];
  return networks.map(n => n.currency);
};

const getManifestCategories = (manifest: AppManifest): string[] => {
  const { categories = [] } = manifest;
  return categories;
};

const getEnabledOptionsValues = (options: Option[]): string[] => {
  return options.filter(o => o.checked).map(o => o.value);
};

const SectionLiveApps: React.FC<SectionBaseProps> = ({ manifests, handleClick }: Props) => {
  const { t } = useTranslation();

  const { categories, networks } = useMemo(() => {
    const currencies = listSupportedCurrencies();
    const reducer = (
      {
        categoriesIds: accCategoriesIds = [],
        networksIds: accNetworksIds = [],
      }: CategoriesIdsAndNetworksIds,
      manifest: AppManifest,
    ): { categoriesIds: string[]; networksIds: string[] } => {
      const categories = getManifestCategories(manifest);
      const networks = getManifestNetworks(manifest);
      const pushIfNotIncluded = (acc: string[] = [], val: string) => {
        return acc.includes(val) ? acc : [...acc, val];
      };
      return {
        networksIds: networks.reduce(pushIfNotIncluded, accNetworksIds),
        categoriesIds: categories.reduce(pushIfNotIncluded, accCategoriesIds),
      };
    };
    const { categoriesIds, networksIds }: CategoriesIdsAndNetworksIds = manifests.reduce(reducer, {
      categoriesIds: [],
      networksIds: [],
    });
    return {
      categories: sortBy(
        categoriesIds.map(categoryId => ({
          value: categoryId,
          label: t(`platform.catalog.category.${categoryId}`),
        })),
        "label",
      ),
      networks: [
        { value: "none", label: t("platform.catalog.noNetwork") },
        ...sortBy(
          networksIds.map(networkId => ({
            value: networkId,
            label: currencies.find(c => c.id === networkId)?.name || networkId,
          })),
          "label",
        ),
      ],
    };
  }, [manifests, t]);

  const [networksOptions, setNetworksOptions] = useState(getInitialOptions(networks));
  const [categoriesOptions, setCategoriesOptions] = useState(getInitialOptions(categories));

  const isAllOnNetworks = networksOptions.every(opt => opt.checked);
  const isAllOnCategories = categoriesOptions.every(opt => opt.checked);

  const handleAllPressedNetworks = useCallback(() => {
    setNetworksOptions(networksOptions.map(opt => ({ ...opt, checked: !isAllOnNetworks })));
  }, [networksOptions, isAllOnNetworks, setNetworksOptions]);
  const handleAllPressedCategories = useCallback(() => {
    setCategoriesOptions(categoriesOptions.map(opt => ({ ...opt, checked: !isAllOnCategories })));
  }, [categoriesOptions, isAllOnCategories, setCategoriesOptions]);

  const right = (
    <Flex flexDirection="row">
      <DropdownPicker
        isAllOn={isAllOnNetworks}
        options={networksOptions}
        onChange={setNetworksOptions}
        onPressAll={handleAllPressedNetworks}
        label={t("platform.catalog.networks")}
      />
      <DropdownPicker
        isAllOn={isAllOnCategories}
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
      const networks = getManifestNetworks(manifest);
      const categories = getManifestCategories(manifest);
      const networksCondition =
        isAllOnNetworks ||
        networks.some(n => enabledNetworks.includes(n)) ||
        (networks.length === 0 && enabledNetworks.includes("none"));
      const categoriesCondition =
        isAllOnCategories || categories.some(c => enabledCategories.includes(c));
      return networksCondition && categoriesCondition;
    });
  }, [manifests, enabledNetworks, enabledCategories, isAllOnNetworks, isAllOnCategories]);

  return (
    <Flex flexDirection="column">
      <SectionHeader title={t("platform.catalog.liveApps")} right={right} />
      <Flex flexDirection="column" rowGap="12px">
        {filteredManifests.map(manifest => (
          <AppRow
            key={manifest.id}
            id={`platform-catalog-app-${manifest.id}`}
            manifest={manifest}
            onClick={() => handleClick(manifest)}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default SectionLiveApps;
