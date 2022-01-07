import { PromotedApp } from "@ledgerhq/live-common/lib/platform/types";
import { Flex, Grid, Icons } from "@ledgerhq/react-ui";
import { keyBy } from "lodash";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import AppThumbnailBig from "~/renderer/components/Platform/AppThumbnailBig";
import SectionHeader from "~/renderer/components/Platform/SectionHeader";
import { SectionBaseProps } from "./types";

const NB_PER_PAGE = 3;
const AppsContainer = styled(Grid).attrs({
  gridTemplateColumns: `repeat(auto-fill, calc(${100 / NB_PER_PAGE}% - 16px * ${NB_PER_PAGE -
    1} / ${NB_PER_PAGE}))`,
  columnGap: "16px",
  flexDirection: "row",
})``;

const Button = styled.div`
  :hover {
    ${(p: { enabled: boolean }) => p.enabled && "cursor: pointer"};
  }
`;
const Arrow = styled.div.attrs((p: { enabled: boolean }) => ({
  color: p.enabled ? "neutral.c100" : "neutral.c70",
}))<{ enabled: boolean }>``;

const ArrowLeft = styled(Arrow)``.withComponent(Icons.ArrowLeftMedium);
const ArrowRight = styled(Arrow)``.withComponent(Icons.ArrowRightMedium);

const SectionSuggestedApps = ({ manifests, catalogMetadata, handleClick }: SectionBaseProps) => {
  const { t } = useTranslation();
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);
  const manifestsById = useMemo(() => keyBy(manifests, "id"), [manifests]);
  const { promotedApps = [] } = catalogMetadata || {};
  const apps = promotedApps.filter(p => !!manifestsById[p.id]);
  const visibleApps = apps.slice(firstVisibleIndex, firstVisibleIndex + NB_PER_PAGE);
  const totalAppsLength = apps.length;
  const visibleAppsLength = visibleApps.length;

  const showArrows = visibleAppsLength < totalAppsLength;
  const leftButtonEnabled = firstVisibleIndex > 0;
  const rightButtonEnabled = totalAppsLength > firstVisibleIndex + NB_PER_PAGE;

  const handleClickLeft = useCallback(() => {
    leftButtonEnabled && setFirstVisibleIndex(firstVisibleIndex - 1);
  }, [leftButtonEnabled, setFirstVisibleIndex, firstVisibleIndex]);
  const handleClickRight = useCallback(() => {
    rightButtonEnabled && setFirstVisibleIndex(firstVisibleIndex + 1);
  }, [rightButtonEnabled, setFirstVisibleIndex, firstVisibleIndex]);

  if (apps.length === 0) return null;
  const arrowButtons = showArrows && (
    <Flex flexDirection="row" columnGap="4px">
      <Button enabled={leftButtonEnabled} onClick={handleClickLeft}>
        <ArrowLeft size={24} enabled={leftButtonEnabled} />
      </Button>
      <Button enabled={rightButtonEnabled} onClick={handleClickRight}>
        <ArrowRight size={24} enabled={rightButtonEnabled} />
      </Button>
    </Flex>
  );

  return (
    <Flex flexDirection="column">
      <SectionHeader title={t("platform.catalog.suggested")} right={arrowButtons} />
      <AppsContainer>
        {visibleApps.map((promotedApp: PromotedApp, index: number) => {
          const manifest = manifestsById[promotedApp.id];
          return (
            <AppThumbnailBig
              key={`thumbnail_${promotedApp.id}_${index}`}
              manifest={manifest}
              thumbnailUrl={promotedApp.thumbnailUrl}
              onClick={handleClick}
            />
          );
        })}
      </AppsContainer>
    </Flex>
  );
};

export default memo(SectionSuggestedApps);
