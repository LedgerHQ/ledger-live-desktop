// @flow

import React, { useCallback } from "react";
import styled, { css } from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box, { Tabbable } from "~/renderer/components/Box";

const IconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({ mb: 2 }))``;

const FooterContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  mt: "auto",
  pt: 2,
  width: "100%",
}))``;

const Container: ThemedComponent<{ isActive?: boolean, disabled?: boolean }> = styled(
  Tabbable,
).attrs(p => ({
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  px: 4,
  py: 5,
  fontSize: 4,
}))`
  min-width: 192px;
  border-radius: 4px;
  cursor: ${p => (p.disabled ? "default" : "pointer")};
  color: ${p => p.theme.colors.palette.text.shade100};

  ${p =>
    p.disabled &&
    css`
      background: ${p.theme.colors.palette.text.shade10};
      opacity: 0.5;

      ${IconContainer} {
        filter: grayscale(100%);
      }
    `}

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

const Content: ThemedComponent<{}> = styled(Box)`
  margin-top: 16px;
  width: 100%;
  max-width: 260px;

  :empty {
    display: none;
  }
`;

type Props = {
  children?: React$Node,
  title: string,
  isActive?: boolean,
  disabled?: boolean,
  icon?: React$Node,
  footer?: React$Node,
  onClick?: Function,
};

const CardButton = ({ children, title, icon, footer, onClick, isActive, disabled }: Props) => {
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  return (
    <Container
      isInteractive={!!onClick}
      isActive={isActive}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <IconContainer>{icon}</IconContainer>}
      <Title>{title}</Title>
      <Content>{children}</Content>
      {footer && <FooterContainer>{footer}</FooterContainer>}
    </Container>
  );
};

export default CardButton;
