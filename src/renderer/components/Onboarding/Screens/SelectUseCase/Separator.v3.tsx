import React from "react";
import styled from "styled-components";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";

const SeparatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px 0px;
  width: 100%;
  align-items: center;
`;

const SeparatorLine = styled.div`
  background-color: ${p => p.theme.colors.palette.neutral.c40};
  height: 1px;
  flex: 1;
`;

interface SeparatorProps {
  label: string;
}

export function Separator({ label }: SeparatorProps) {
  return (
    <SeparatorContainer>
      <SeparatorLine />
    </SeparatorContainer>
  );
}
