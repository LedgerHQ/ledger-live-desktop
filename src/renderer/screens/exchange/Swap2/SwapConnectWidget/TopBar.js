// @flow

// FIXME: very similar to src/renderer/components/WebPlatformPlayer/TopBar.js

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";

import Box, { Tabbable } from "~/renderer/components/Box";

import IconReload from "~/renderer/icons/UpdateCircle";
import LightBulb from "~/renderer/icons/LightBulb";
import IconClose from "~/renderer/icons/Cross";

import { useSelector } from "react-redux";
import { enablePlatformDevToolsSelector } from "~/renderer/reducers/settings";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
}))`
  padding: 10px 16px;
  background-color: ${p => p.theme.colors.palette.background.paper};
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

const TitleContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
  ff: "Inter|SemiBold",
}))`
  margin-right: 16px;
  color: ${p =>
    p.theme.colors.palette.type === "dark" ? p.theme.colors.white : p.theme.colors.black};

  > * + * {
    margin-left: 8px;
  }
`;

const RightContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: 0,
  alignItems: "center",
  ml: "auto",
}))``;

const ItemContainer: ThemedComponent<{
  "data-e2e"?: string,
  isInteractive?: boolean,
  onClick?: () => void,
  disabled?: boolean,
  children: React$Node,
  justifyContent?: string,
}> = styled(Tabbable).attrs(p => ({
  padding: 1,
  alignItems: "center",
  cursor: p.disabled ? "not-allowed" : "default",
  horizontal: true,
  borderRadius: 1,
}))`
  -webkit-app-region: no-drag;
  height: 24px;
  position: relative;
  cursor: pointer;
  pointer-events: ${p => (p.disabled ? "none" : "unset")};

  margin-right: 16px;
  &:last-child {
    margin-right: 0;
  }

  > * + * {
    margin-left: 8px;
  }

  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.05))};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.1))};
  }
`;

const ItemContent: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
}))`
  font-size: 14px;
  line-height: 20px;
`;

export const Separator: ThemedComponent<*> = styled.div`
  margin-right: 16px;
  height: 15px;
  width: 1px;
  background: ${p => p.theme.colors.palette.divider};
`;

export type Props = {
  name: string,
  icon?: boolean,
  onClose?: Function,
  // $FlowFixMe
  webviewRef: React.MutableRefObject<any>,
};

const TopBar = ({ name, onClose, webviewRef }: Props) => {
  const enablePlatformDevTools = useSelector(enablePlatformDevToolsSelector);

  const handleReload = () => {
    const webview = webviewRef.current;
    if (webview) {
      webview.reloadIgnoringCache();
    }
  };

  const handleOpenDevTools = () => {
    const webview = webviewRef.current;
    if (webview) {
      webview.openDevTools();
    }
  };

  return (
    <Container>
      <TitleContainer>
        {/* FIXME: should display provider icon */}
        {/* <LiveAppIcon name={name} icon={icon || undefined} size={20} /> */}
        <ItemContent>{name}</ItemContent>
      </TitleContainer>
      <Separator />
      <ItemContainer isInteractive onClick={handleReload}>
        <IconReload size={16} />
        <ItemContent>
          <Trans i18nKey="common.sync.refresh" />
        </ItemContent>
      </ItemContainer>

      {enablePlatformDevTools ? (
        <>
          <Separator />
          <ItemContainer isInteractive onClick={handleOpenDevTools}>
            <LightBulb size={16} />
            <ItemContent>
              <Trans i18nKey="common.sync.devTools" />
            </ItemContent>
          </ItemContainer>
        </>
      ) : null}
      <RightContainer>
        <ItemContainer isInteractive onClick={onClose}>
          <IconClose size={16} />
        </ItemContainer>
      </RightContainer>
    </Container>
  );
};

export default TopBar;
