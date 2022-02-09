// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";

const SeparatorContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 50px 0px;
  width: 100%;
  align-items: center;
  color: rgba(138, 128, 219, 0.7);
`;

const SeparatorLine = styled.div`
  background-color: rgba(138, 128, 219, 0.7);
  height: 1px;
  flex: 1;
`;

type SeparatorProps = {
  label: string,
};

export function Separator({ label }: SeparatorProps) {
  return (
    <SeparatorContainer>
      <SeparatorLine />
      <Text
        ml="6px"
        mr="6px"
        color="palette.primary.main"
        ff="Inter|Bold"
        fontSize="10px"
        uppercase
        letterSpacing="0.1em"
      >
        {label}
      </Text>
      <SeparatorLine />
    </SeparatorContainer>
  );
}
