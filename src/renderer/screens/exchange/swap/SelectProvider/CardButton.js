// @flow

import React from "react";
import styled, { css } from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box, { Tabbable } from "~/renderer/components/Box";

const Container: ThemedComponent<{ isActive?: boolean }> = styled(Tabbable).attrs(p => ({
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  px: 4,
  py: 5,
  fontSize: 3,
}))`
  cursor: pointer;
  min-width: 192px;
  border-radius: 4px;
  margin: 12px;

  &,
  &:focus {
    ${p =>
      p.isActive &&
      css`
        box-shadow: 0px 0px 0px 4px ${rgba(p.theme.colors.palette.primary.main, 0.25)};
      `}
  }

  border: ${p =>
    p.isActive
      ? `1px solid ${p.theme.colors.palette.primary.main}`
      : `1px solid ${p.theme.colors.palette.divider}`};
`;

const Title: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 5,
  textAlign: "center",
  color: p.theme.colors.palette.secondary.main,
}))``;

const Content: ThemedComponent<{}> = styled(Box).attrs(p => ({
  p: 4,
}))`
  width: 100%;
`;

const IconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({ mb: 2 }))``;

const FooterContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({ mt: "auto" }))``;

type Props = {
  children?: React$Node,
  title: string,
  isActive?: boolean,
  icon?: React$Node,
  footer?: React$Node,
  onClick?: Function,
};

const CardButton = ({ children, title, isActive, icon, footer, onClick }: Props) => {
  return (
    <Container isInteractive={!!onClick} isActive={isActive} onClick={onClick}>
      {icon && <IconContainer>{icon}</IconContainer>}
      <Title>{title}</Title>
      <Content>{children}</Content>
      {footer && <FooterContainer>{footer}</FooterContainer>}
    </Container>
  );
};

export default CardButton;
