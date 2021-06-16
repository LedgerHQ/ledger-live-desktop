// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getEnv } from "@ledgerhq/live-common/lib/env";
import { useCatalog } from "@ledgerhq/live-common/lib/platform/CatalogProvider";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Alert from "~/renderer/components/Alert";
import IconCode from "~/renderer/icons/Code";
import IconExternalLink from "~/renderer/icons/ExternalLink";

import AppCard from "~/renderer/components/Platform/AppCard";
import CatalogCTA from "./CatalogCTA";
import CatalogBanner from "./CatalogBanner";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;
  width: 100%;
  justify-content: stretch;
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

const DeveloperCTA = styled(CatalogCTA)`
  background: ${p => p.theme.colors.palette.text.shade5};

  ${Grid} > &:nth-child(3n-2) {
    grid-column: span 3;
  }

  ${Grid} > &:nth-child(3n-1) {
    grid-column: span 2;
  }

  ${Grid} > &:nth-child(3n) {
    grid-column: span 1;
  }
`;

const PlatformCatalog = () => {
  const history = useHistory();
  const appBranches = useMemo(() => {
    const branches = ["stable"];

    // TODO: add experimental setting

    if (getEnv("PLATFORM_DEBUG")) {
      branches.push("debug");
    }

    return branches;
  }, []);
  const isCatalogManifestOverriden = !!getEnv("PLATFORM_MANIFEST_PATH");

  const { apps } = useCatalog(appBranches);

  const { t } = useTranslation();

  const handleDeveloperCTA = useCallback(() => {
    openURL(urls.platform.developerPage);
  }, []);

  const handleClick = useCallback(
    manifest => {
      history.push(`/platform/${manifest.id}`);
    },
    [history],
  );

  return (
    <>
      <TrackPage category="Platform" name="Catalog" />
      <Header>
        <Title>{t("platform.catalog.title")}</Title>
      </Header>
      {isCatalogManifestOverriden && (
        <Alert type="danger" mb={4} style={{ flex: 0 }}>
          {t("platform.catalog.manifestOverriden")}
        </Alert>
      )}
      <CatalogBanner />
      <Grid length={apps.length}>
        {apps.map(manifest => (
          <GridItem key={manifest.id}>
            <AppCard
              id={`platform-catalog-app-${manifest.id}`}
              manifest={manifest}
              onClick={() => handleClick(manifest)}
            />
          </GridItem>
        ))}
        <DeveloperCTA
          title={t("platform.catalog.developerCTA.title")}
          Icon={IconCode}
          onClick={handleDeveloperCTA}
          ctaLabel={
            <>
              <span>{t("platform.catalog.developerCTA.button")}</span>
              <IconExternalLink size={14} />
            </>
          }
        >
          {t("platform.catalog.developerCTA.description")}
        </DeveloperCTA>
      </Grid>
    </>
  );
};

export default PlatformCatalog;
