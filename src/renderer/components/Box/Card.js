// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";
import Box from "./Box";

export type RawCardProps = {
  bg?: string,
  color?: string,
};

export const RawCard: ThemedComponent<RawCardProps> = styled(Box).attrs(p => ({
  bg: p.bg || "palette.background.paper",
  boxShadow: 0,
  borderRadius: 1,
  color: p.color || "inherit",
}))``;

export type CardProps = {
  ...RawCardProps,
  title?: any,
  children?: React$Node,
};

const Card = ({ title, ...props }: CardProps) => {
  if (title) {
    return (
      <Box flow={4} grow>
        <Text color="palette.text.shade100" ff="Inter" fontSize={6}>
          {title}
        </Text>
        <RawCard {...props} grow />
      </Box>
    );
  }
  return <RawCard {...props} />;
};

export default Card;
