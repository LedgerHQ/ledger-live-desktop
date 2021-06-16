// @flow
import React from "react";

import styled from "styled-components";
import { useTranslation } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import PlatformCatalogIllu from "~/renderer/images/platform-catalog-illu.svg";

import Box from "../../components/Box";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  flex: 0,
  horizontal: true,
  fontSize: 4,
  color: p.theme.colors.palette.primary.contrastText,
  backgroundColor: p.theme.colors.palette.primary.main,
  mb: 24,
}))`
  min-height: 121px;
  border-radius: 4px;
  align-items: stretch;
  justify-content: space-between;
`;

const Title = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  horizontal: true,
  alignItems: "center",
  mb: 3,
}))`
  word-break: break-word;
`;

const Content = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  flex: 1,
  alignItems: "flex-start",
}))`
  padding: 24px;
`;

const Illustration = styled.img.attrs(() => ({ src: PlatformCatalogIllu }))`
  width: auto;
  height: 100%;
`;

export default function CatalogBanner() {
  const { t } = useTranslation();

  return (
    <Container>
      <Content>
        <Title>{t("platform.catalog.banner.title")}</Title>
        <div>{t("platform.catalog.banner.description")}</div>
      </Content>

      <Illustration />
    </Container>
  );
}
