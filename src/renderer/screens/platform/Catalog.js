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
import Text from "~/renderer/components/Text";

import IconCode from "~/renderer/icons/Code";
import IconPoll from "~/renderer/icons/Poll";
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
  margin-bottom: auto;
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

const PollCTA = styled(CatalogCTA)`
  background: transparent;
  border: 1px dashed ${p => p.theme.colors.palette.divider};
  color: ${p => p.theme.colors.palette.text.shade50};
`;

const PollText = styled(Text).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.theme.colors.palette.secondary.main,
}))``;

const DeveloperCTA = styled(CatalogCTA)`
  background: ${p => p.theme.colors.palette.text.shade5};
  margin-top: 24px;
  flex-grow: 0;
  color: ${p => p.theme.colors.palette.secondary.main};
`;

const DeveloperText = styled(Text).attrs(p => ({ color: p.theme.colors.palette.text.shade50 }))``;

const PlatformCatalog = () => {
  const history = useHistory();
  const appBranches = useMemo(() => {
    const branches = ["stable", "soon", "experimental"];

    // TODO: add experimental setting

    if (getEnv("PLATFORM_DEBUG")) {
      branches.push("debug");
    }

    return branches;
  }, []);

  const { apps } = useCatalog(appBranches);

  const { t } = useTranslation();

  const handleDeveloperCTA = useCallback(() => {
    openURL(urls.platform.developerPage);
  }, []);

  const handlePollCTA = useCallback(() => {
    openURL(urls.platform.poll);
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
        <PollCTA
          title={t("platform.catalog.pollCTA.title")}
          Icon={IconPoll}
          onClick={handlePollCTA}
          ctaLabel={
            <>
              <span>{t("platform.catalog.pollCTA.button")}</span>
              <IconExternalLink size={14} />
            </>
          }
        >
          <PollText>{t("platform.catalog.pollCTA.description")}</PollText>
        </PollCTA>
      </Grid>
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
        <DeveloperText>{t("platform.catalog.developerCTA.description")}</DeveloperText>
      </DeveloperCTA>
    </>
  );
};

export default PlatformCatalog;
