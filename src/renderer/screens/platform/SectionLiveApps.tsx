import React, { useMemo } from "react";
import { Flex } from "@ledgerhq/react-ui";
import { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { useTranslation } from "react-i18next";
import { sortBy } from "lodash";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import AppRow from "~/renderer/components/Platform/AppRow";
import { SectionBaseProps } from "./types";
import { listSupportedCurrencies } from "@ledgerhq/live-common/lib/currencies";

type Props = SectionBaseProps;

type CategoriesIdsAndNetworksIds = { categoriesIds: string[]; networksIds: string[] };

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
      const { params = {}, categories = [] } = manifest;
      const networks: { currency: string }[] = params.networks || [];
      const pushIfNotIncluded = (acc: string[] = [], val: string) => {
        return acc.includes(val) ? acc : [...acc, val];
      };
      return {
        networksIds: networks.map(n => n.currency).reduce(pushIfNotIncluded, accNetworksIds),
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
      networks: sortBy(
        networksIds.map(networkId => ({
          value: networkId,
          label: currencies.find(c => c.id === networkId)?.name || networkId,
        })),
        "label",
      ),
    };
  }, [manifests, t]);
  // console.log("categories & networks", { categories, networks });
  return (
    <>
      <SectionHeader title="live apps" />
      <Flex flexDirection="column" rowGap="12px">
        {manifests.map(manifest => (
          <AppRow
            key={manifest.id}
            id={`platform-catalog-app-${manifest.id}`}
            manifest={manifest}
            onClick={() => handleClick(manifest)}
          />
        ))}
      </Flex>
    </>
  );
};

export default SectionLiveApps;
