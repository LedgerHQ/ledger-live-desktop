import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Flex, Grid } from "@ledgerhq/react-ui";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";

import { SectionBaseProps } from "./types";
import AppThumbnailSmall from "~/renderer/components/Platform/AppThumbnailSmall";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { platformAppsLastOpenedSelector } from "~/renderer/reducers/settings";

const MAX_APPS = 4;
const AppsContainer = styled(Grid).attrs({
  gridTemplateColumns: `repeat(auto-fill, calc(${100 / MAX_APPS}% - 16px * ${MAX_APPS - 1} / ${MAX_APPS}))`,
  columnGap: "16px",
  flexDirection: "row",
})``;

const SectionRecentlyUsed = ({ manifests, handleClick }: SectionBaseProps) => {
  const { t } = useTranslation();
  const platformAppsLastOpened = useSelector(platformAppsLastOpenedSelector);
  const filteredManifests = useMemo(() => {
    return manifests
      .filter(({ name }) => platformAppsLastOpened.hasOwnProperty(name))
      .sort(
        ({ name: name1 }, { name: name2 }) =>
          (platformAppsLastOpened[name2] || 0) - (platformAppsLastOpened[name1] || 0),
      )
      .slice(0, MAX_APPS);
  }, [platformAppsLastOpened, manifests]);
  if (filteredManifests.length === 0) return null;
  return (
    <Flex flexDirection="column">
      <SectionHeader title={t("platform.catalog.recentlyUsed")} />
      <AppsContainer>
        {filteredManifests.map(manifest => (
          <AppThumbnailSmall key={manifest.id} manifest={manifest} onClick={handleClick} />
        ))}
      </AppsContainer>
    </Flex>
  );
};

export default SectionRecentlyUsed;
