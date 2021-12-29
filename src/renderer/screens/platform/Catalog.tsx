import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  allowDebugAppsSelector,
  allowExperimentalAppsSelector,
  dismissedBannersSelector,
} from "~/renderer/reducers/settings";
import { Text, Flex } from "@ledgerhq/react-ui";

import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { filterPlatformApps } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/helpers";
import TrackPage from "~/renderer/analytics/TrackPage";

import { openPlatformAppDisclaimerDrawer } from "~/renderer/actions/UI";

import SectionSuggested from "./SectionSuggested";
import SectionRecentlyUsed from "./SectionRecentlyUsed";
import SectionLiveApps from "./SectionLiveApps";

const DAPP_DISCLAIMER_ID = "PlatformAppDisclaimer";

const Title = styled(Text).attrs({
  variant: "h3",
  fontSize: "28px",
  lineHeight: "34px",
})``;

const PlatformCatalog = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { manifests } = usePlatformApp();
  console.log("manifests", { manifests });
  const allowDebugApps = useSelector(allowDebugAppsSelector);
  const allowExperimentalApps = useSelector(allowExperimentalAppsSelector);

  const filteredManifests = useMemo(() => {
    const branches = ["stable", "soon"];

    if (allowDebugApps) {
      branches.push("debug");
    }

    if (allowExperimentalApps) {
      branches.push("experimental");
    }

    return filterPlatformApps(Array.from(manifests.values()), {
      version: "0.0.1",
      platform: "desktop",
      branches,
    });
  }, [allowDebugApps, allowExperimentalApps, manifests]);
  const dismissedBanners = useSelector(dismissedBannersSelector);
  const isDismissed = dismissedBanners.includes(DAPP_DISCLAIMER_ID);

  const { t } = useTranslation();

  const handleClick = useCallback(
    manifest => {
      const openApp = () => history.push(`/platform/${manifest.id}`);

      if (!isDismissed) {
        dispatch(
          openPlatformAppDisclaimerDrawer({
            manifest,
            disclaimerId: DAPP_DISCLAIMER_ID,
            next: openApp,
          }),
        );
      } else {
        openApp();
      }
    },
    [history, isDismissed, dispatch],
  );

  return (
    <Flex flexDirection="column" pb="60px">
      <TrackPage category="Platform" name="Catalog" />
      <Title mb="48px">{t("platform.catalog.title")}</Title>
      <SectionSuggested manifests={filteredManifests} handleClick={handleClick} />
      <SectionRecentlyUsed manifests={filteredManifests} handleClick={handleClick} />
      <SectionLiveApps manifests={filteredManifests} handleClick={handleClick} />
    </Flex>
  );
};

export default PlatformCatalog;
