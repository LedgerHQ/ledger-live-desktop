// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "./Box/Box";
import Text from "./Text";

type Props = {
  children?: React$Node,
};

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  py: 1,
  px: 2,
  my: 1,
  borderRadius: 4,
  bg: "blueTransparentBackground",
}))`
  display: inline-block;
`;

const TextContainer: ThemedComponent<{}> = styled(Text).attrs(() => ({
  ff: "Inter|Bold",
  fontSize: 2,
  color: "wallet",
}))`
  text-transform: uppercase;
`;

const BadgeLabel = ({ children }: Props) =>
  children ? (
    <Container>
      <TextContainer>{children}</TextContainer>
    </Container>
  ) : null;

export default BadgeLabel;
