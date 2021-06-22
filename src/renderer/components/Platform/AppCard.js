// @flow

import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";
import { translateContent } from "@ledgerhq/live-common/lib/platform/logic";

import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { languageSelector } from "~/renderer/reducers/settings";

import Box, { Tabbable } from "~/renderer/components/Box";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";

function getBranchColor(branch, colors) {
  switch (branch) {
    case "soon":
      return colors.palette.text.shade100;
    case "experimental":
      return colors.warning;
    case "debug":
      return colors.palette.text.shade40;
    default:
      return "currentColor";
  }
}

const Container: ThemedComponent<{ isActive?: boolean, disabled?: boolean }> = styled(
  Tabbable,
).attrs(p => ({
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  fontSize: 4,
}))`
  min-height: 180px;
  padding: 24px;
  border-radius: 4px;
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  background: ${p => p.theme.colors.palette.background.paper};
  color: ${p => p.theme.colors.palette.text.shade100};
  border: 1px solid ${p => p.theme.colors.palette.divider};

  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.04);

  ${p =>
    p.disabled
      ? css`
          background: ${p.theme.colors.palette.text.shade10};
          opacity: 0.5;

          ${IconContainer} {
            filter: grayscale(100%);
          }
        `
      : css`
          &:hover,
          &:focus {
            ${p =>
              css`
                box-shadow: 0px 0px 0px 4px ${rgba(p.theme.colors.palette.primary.main, 0.25)};
                border: ${p => `1px solid ${p.theme.colors.palette.primary.main}`};
              `}
          }
        `}
`;

const HeaderContainer: ThemedComponent<{}> = styled(Box)`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

const IconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({ mr: 2 }))``;

const TitleContainer: ThemedComponent<{}> = styled.div`
  flex-shrink: 1;
`;

const AppName: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  textAlign: "left",
  color: p.theme.colors.palette.secondary.main,
}))`
  line-height: 18px;
`;

const Content: ThemedComponent<{}> = styled(Box)`
  margin-top: 16px;
  width: 100%;

  :empty {
    display: none;
  }
`;

const BranchBadge: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 1,
  color: getBranchColor(p.branch, p.theme.colors),
}))`
  display: inline-block;
  padding: 1px 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  text-transform: uppercase;
  margin-bottom: 4px;
  flex-grow: 0;
  flex-shrink: 1;

  ${p =>
    p.branch === "soon" &&
    `
    background: ${p.theme.colors.palette.text.shade20};
    border-width: 0;
  `}
`;

type Props = {
  manifest: AppManifest,
  onClick: Function,
};

const AppCard = ({ manifest, onClick, ...rest }: Props) => {
  const { t } = useTranslation();
  const language = useSelector(languageSelector);
  const isDisabled = manifest.branch === "soon";

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onClick();
    }
  }, [onClick, isDisabled]);

  return (
    <Container {...rest} isInteractive={!!onClick} onClick={handleClick} disabled={isDisabled}>
      <HeaderContainer>
        <IconContainer>
          <LiveAppIcon icon={manifest.icon || undefined} name={manifest.name} size={48} />
        </IconContainer>
        <TitleContainer>
          {manifest.branch !== "stable" && (
            <BranchBadge branch={manifest.branch}>
              {t(`platform.catalog.branches.${manifest.branch}`)}
            </BranchBadge>
          )}
          <AppName>{manifest.name}</AppName>
        </TitleContainer>
      </HeaderContainer>
      <Content>{translateContent(manifest.content.shortDescription, language)}</Content>
    </Container>
  );
};

export default AppCard;
