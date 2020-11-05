// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

import { dismissedBannersSelector } from "~/renderer/reducers/settings";
import { dismissBanner } from "~/renderer/actions/settings";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { radii } from "~/renderer/styles/theme";

import IconCross from "~/renderer/icons/Cross";
import Box from "~/renderer/components/Box";

const IconContainer = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`;

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  alignItems: "center",
  py: "8px",
  px: 3,
  bg: p.theme.colors[p.status] || "palette.primary.main",
  color: "palette.primary.contrastText",
  mb: 20,
  fontSize: 4,
  ff: "Inter|SemiBold",
}))`
  border-radius: ${radii[1]}px;
`;

const RightContainer = styled.div`
  margin-left: auto;
`;

export const FakeLink: ThemedComponent<{}> = styled.span`
  color: ${p => p.theme.colors.palette.primary.contrastText};
  text-decoration: underline;
  cursor: pointer;
`;

const CloseContainer = styled(Box).attrs(() => ({
  color: "palette.primary.contrastText",
}))`
  z-index: 1;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: #eee;
  }

  &:active {
    color: #eee;
  }
`;

export type Content = {
  Icon?: React$ComponentType<any>,
  message: React$Node,
  right?: React$Node,
};

type Props = {
  content?: Content,
  status?: string,
  dismissable?: boolean,
  bannerId?: string,
};

const TopBanner = ({ content, status = "", dismissable = false, bannerId }: Props) => {
  const dispatch = useDispatch();
  const dismissedBanners = useSelector(dismissedBannersSelector);

  const onDismiss = useCallback(() => {
    if (bannerId) {
      dispatch(dismissBanner(bannerId));
    }
  }, [bannerId, dispatch]);

  if (!content || (bannerId && dismissedBanners.includes(bannerId))) return null;

  const { Icon, message, right } = content;

  return (
    <Container status={status}>
      {Icon && (
        <IconContainer>
          <Icon size={16} />
        </IconContainer>
      )}
      {message}
      <RightContainer>{right}</RightContainer>
      {dismissable && (
        <CloseContainer id={`dismiss-${bannerId || ""}-banner`} onClick={onDismiss}>
          <IconCross size={14} />
        </CloseContainer>
      )}
    </Container>
  );
};

export default TopBanner;
