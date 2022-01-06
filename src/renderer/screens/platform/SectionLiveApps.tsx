import React, { useMemo, useCallback, useState } from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import { AppManifest, AppMetadata } from "@ledgerhq/live-common/lib/platform/types";
import { useTranslation, TFunction } from "react-i18next";
import { keyBy, sortBy } from "lodash";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import DropdownPicker, { CheckboxText, Option } from "~/renderer/components/DropdownPicker";
import styled from "styled-components";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";

const VerticalSeparator = styled(Flex).attrs({
  width: "0",
  height: "16px",
  borderLeft: "1px solid",
  borderColor: "neutral.c40",
})``;

const ResetCTA = styled(Text).attrs({
  color: "primary.c80",
  variant: "paragraph",
  fontWeight: "medium",
  fontSize: "13px",
  lineHeight: "16px",
})`
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

type Props = SectionBaseProps;

type CategoriesIdsAndNetworksIds = { supercategories: string[]; networksIds: string[] };

const getInitialOptions = (options: Option[]): Option[] => {
  return [
    ...options.map(opt => ({
      ...opt,
      checked: false,
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

const makeCategoryOption = (t: TFunction, categoryId: string): Option => ({
  value: categoryId,
  label: t(`platform.catalog.category.${categoryId}`, categoryId),
});

const makeNetworkOption = (t: TFunction, networkId: string): Option => {
  const currency = getCryptoCurrencyById(networkId);
  return {
    value: networkId,
    label: (
      <Flex flex={1} alignItems="center" justifyContent="space-between">
        <CheckboxText mr="47px">{currency?.name || networkId}</CheckboxText>
        <CryptoCurrencyIcon
          key={currency.id}
          circle
          currency={currency}
          size={24}
          circleOverrideIconColor="white"
        />
      </Flex>
    ),
  };
};

const getAppMetadataFromManifest = (
  manifest: AppManifest,
  map: Record<string, AppMetadata>,
): AppMetadata | undefined => {
  return map[manifest.id] || undefined;
};

const SectionLiveApps: React.FC<SectionBaseProps> = ({
  manifests,
  catalogMetadata,
  handleClick,
}: Props) => {
  const { t } = useTranslation();
  const { appsMetadata = [] } = catalogMetadata || {};

  const appsMetadataMappedById: Record<string, AppMetadata> = useMemo(
    () => keyBy(appsMetadata, "id"),
    [appsMetadata],
  );

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
        supercategories.map(supercategory => makeCategoryOption(t, supercategory)),
        "label",
      ),
      networks: [
        ...sortBy(
          networksIds.map(networkId => makeNetworkOption(t, networkId)),
          "label",
        ),
        { value: "none", label: t("platform.catalog.noNetwork") },
      ],
    };
  }, [appsMetadata, t]);

  const [networksOptions, setNetworksOptions] = useState(getInitialOptions(networks));
  const [categoriesOptions, setCategoriesOptions] = useState(getInitialOptions(supercategories));

  const noNetworkSelected = networksOptions.every(opt => !opt.checked);
  const noCategorySelected = categoriesOptions.every(opt => !opt.checked);

  const showResetCTA = !(noNetworkSelected && noCategorySelected);

  const handleClickReset = useCallback(() => {
    setNetworksOptions(getInitialOptions(networks));
    setCategoriesOptions(getInitialOptions(supercategories));
  }, [setNetworksOptions, networks, setCategoriesOptions, supercategories]);

  const right = catalogMetadata && (
    <Flex flexDirection="row" zIndex={1} alignItems="center" columnGap="20px">
      {showResetCTA && (
        <>
          <ResetCTA onClick={handleClickReset}>{t("platform.catalog.resetFilters")}</ResetCTA>
          <VerticalSeparator />
        </>
      )}
      <DropdownPicker
        options={networksOptions}
        hideLabelValue={noNetworkSelected}
        onChange={setNetworksOptions}
        label={t("platform.catalog.networkFilterLabel")}
      />
      <DropdownPicker
        options={categoriesOptions}
        hideLabelValue={noCategorySelected}
        onChange={setCategoriesOptions}
        label={t("platform.catalog.categoryFilterLabel")}
      />
    </Flex>
  );

  const enabledNetworks = getEnabledOptionsValues(networksOptions);
  const enabledCategories = getEnabledOptionsValues(categoriesOptions);
  const filteredManifests = useMemo(() => {
    return manifests.filter(manifest => {
      const appMetadata = getAppMetadataFromManifest(manifest, appsMetadataMappedById);
      if (!appMetadata) return true;
      const networks = getAppMetadataNetworks(appMetadata);
      const supercategory = getAppMetadataSuperCategory(appMetadata);
      const hasNoNetwork = networks.length === 0;
      const networksCondition =
        noNetworkSelected ||
        (!hasNoNetwork && enabledNetworks.every(n => networks.includes(n))) ||
        (hasNoNetwork && enabledNetworks.includes("none"));
      const categoriesCondition = noCategorySelected || enabledCategories.includes(supercategory);
      return networksCondition && categoriesCondition;
    });
  }, [
    appsMetadataMappedById,
    enabledNetworks,
    enabledCategories,
    noNetworkSelected,
    noCategorySelected,
    manifests,
  ]);

  const content = useMemo(
    () =>
      filteredManifests.map(manifest => (
        <AppRow
          key={manifest.id}
          id={`platform-catalog-app-${manifest.id}`}
          manifest={manifest}
          appMetadata={getAppMetadataFromManifest(manifest, appsMetadataMappedById)}
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
