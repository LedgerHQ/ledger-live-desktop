// @flow

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

import { usePlatformApp } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider";
import { filterPlatformApps } from "@ledgerhq/live-common/lib/platform/PlatformAppProvider/helpers";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";

import { openPlatformAppDisclaimerDrawer } from "~/renderer/actions/UI";

import AppCard from "~/renderer/components/Platform/AppCard";
import CatalogBanner from "./CatalogBanner";
import TwitterBanner from "./TwitterBanner";

const DAPP_DISCLAIMER_ID = "PlatformAppDisclaimer";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
  justify-content: stretch;
  margin: auto;
  padding-bottom: 32px;
`;

const GridItem = styled.div`
  > * {
    height: 100%;
  }
`;

const Header: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  paddingBottom: 32,
}))``;

const Title: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 7,
  color: p.theme.colors.palette.secondary.main,
}))``;

const PlatformCatalog = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { manifests } = usePlatformApp();
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
    <>
      <TrackPage category="Platform" name="Catalog" />
      <Header>
        <Title>{t("platform.catalog.title")}</Title>
      </Header>
      <CatalogBanner />
      <TwitterBanner />
      <Grid length={filteredManifests.length}>
        {filteredManifests.map(manifest => (
          <GridItem key={manifest.id}>
            <AppCard
              id={`platform-catalog-app-${manifest.id}`}
              manifest={manifest}
              onClick={() => handleClick(manifest)}
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default PlatformCatalog;
