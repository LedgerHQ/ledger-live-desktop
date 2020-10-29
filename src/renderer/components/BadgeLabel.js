// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "./Box/Box";
import Text from "./Text";

type Props = {
  children?: React$Node,
  uppercase?: boolean,
  innerStyle?: any,
};

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 2,
  my: 1,
  borderRadius: 4,
  bg: "blueTransparentBackground",
}))`
  display: inline-block;
`;

const TextContainer: ThemedComponent<{ uppercase: boolean }> = styled(Text).attrs(() => ({
  ff: "Inter|Bold",
  fontSize: 2,
  color: "wallet",
}))`
  text-transform: ${p => (p.uppercase ? "uppercase" : "initial")};
`;

const BadgeLabel = ({ children, uppercase = true, innerStyle = {} }: Props) =>
  children ? (
    <Container style={innerStyle ? { ...innerStyle } : {}}>
      <TextContainer uppercase={uppercase}>{children}</TextContainer>
    </Container>
  ) : null;

export default BadgeLabel;
