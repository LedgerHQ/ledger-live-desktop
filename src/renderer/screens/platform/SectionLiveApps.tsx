import React, { useMemo, useCallback, useState } from "react";
import { Flex, Text } from "@ledgerhq/react-ui";
import { AppManifest, AppMetadata } from "@ledgerhq/live-common/lib/platform/types";
import { useTranslation, TFunction } from "react-i18next";
import { keyBy, sortBy } from "lodash";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";
import DropdownPicker, { Option } from "~/renderer/components/DropdownPicker";
import styled from "styled-components";

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

type AppsMetadataReducerAccumulator = { supercategories: string[] };

const getInitialOptions = (options: Option[]): Option[] => {
  return [
    ...options.map(opt => ({
      ...opt,
      checked: false,
    })),
  ];
};

/**
 * Leaving the following block here so it can be reimplemented quickly when the networks
 * filtering spec is clarified.
 **/
/*
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
const getAppMetadataNetworks = (appMetadata: AppMetadata): string[] => {
  return appMetadata.networks || [];
};
*/

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

  const { supercategories } = useMemo(() => {
    const reducer = (
      { supercategories: accSupercategories = [] }: AppsMetadataReducerAccumulator,
      appMetadata: AppMetadata,
    ): { supercategories: string[] } => {
      const supercategory = getAppMetadataSuperCategory(appMetadata);
      const isAppInManifest = manifests.find(app => app.id === appMetadata.id);
      return {
        supercategories:
          !isAppInManifest || accSupercategories.includes(supercategory)
            ? accSupercategories
            : [...accSupercategories, supercategory],
      };
    };
    const { supercategories }: AppsMetadataReducerAccumulator = appsMetadata.reduce(reducer, {
      supercategories: [],
    });
    return {
      supercategories: sortBy(
        supercategories.map(supercategory => makeCategoryOption(t, supercategory)),
        "label",
      ),
    };
  }, [manifests, appsMetadata, t]);

  /**
   * For now this feature (displaying filtering by network) is put on hold but I will
   * leave this here so it can be reimplemented easily when the spec gets clarified.
   * Otherwise, networks is an array of string identifying cryptocurrencies.
   * It should come either from appsMetadata.
   */
  const [networksOptions, setNetworksOptions] = useState(getInitialOptions([]));
  const [categoriesOptions, setCategoriesOptions] = useState(getInitialOptions(supercategories));

  const noNetworkSelected = networksOptions.every(opt => !opt.checked);
  const noCategorySelected = categoriesOptions.every(opt => !opt.checked);

  const showResetCTA = !(noNetworkSelected && noCategorySelected);

  const handleClickReset = useCallback(() => {
    setCategoriesOptions(getInitialOptions(supercategories));
  }, [setCategoriesOptions, supercategories]);

  const right = catalogMetadata && (
    <Flex flexDirection="row" zIndex={1} alignItems="center" columnGap="20px">
      {showResetCTA && (
        <>
          <ResetCTA onClick={handleClickReset}>{t("platform.catalog.resetFilters")}</ResetCTA>
          <VerticalSeparator />
        </>
      )}
      {networksOptions.length > 0 && (
        <DropdownPicker
          options={networksOptions}
          hideLabelValue={noNetworkSelected}
          onChange={setNetworksOptions}
          label={t("platform.catalog.networkFilterLabel")}
        />
      )}
      <DropdownPicker
        options={categoriesOptions}
        hideLabelValue={noCategorySelected}
        onChange={setCategoriesOptions}
        label={t("platform.catalog.categoryFilterLabel")}
      />
    </Flex>
  );

  // const enabledNetworks = getEnabledOptionsValues(networksOptions);
  const enabledCategories = getEnabledOptionsValues(categoriesOptions);
  const filteredManifests = useMemo(() => {
    return manifests.filter(manifest => {
      const appMetadata = getAppMetadataFromManifest(manifest, appsMetadataMappedById);
      if (!appMetadata) return true;
      const supercategory = getAppMetadataSuperCategory(appMetadata);
      /**
       * Leaving the following block here so it can be reimplemented quickly when the networks
       * filtering spec is clarified.
       **/
      /*
      const networks = getAppMetadataNetworks(appMetadata);
      const hasNoNetwork = networks.length === 0;
      const networksCondition =
        noNetworkSelected ||
        (!hasNoNetwork && enabledNetworks.every(n => networks.includes(n))) ||
        (hasNoNetwork && enabledNetworks.includes("none"));
      */
      const networksCondition = true;
      const categoriesCondition = noCategorySelected || enabledCategories.includes(supercategory);
      return networksCondition && categoriesCondition;
    });
  }, [appsMetadataMappedById, enabledCategories, noCategorySelected, manifests]);

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
