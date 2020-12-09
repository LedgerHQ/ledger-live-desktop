// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";

const IllustrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  transition: transform 150ms ease-in-out;
`;

const UseCaseOptionContainer: ThemedComponent<*> = styled.button`
  border: none;
  outline: none;
  width: 272px;
  padding: 24px;
  box-sizing: border-box;
  background-color: #6490f120;
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 100ms ease-in-out;
  text-align: left;

  &:hover ${IllustrationContainer} {
    transform: scale(0.95);
  }

  &:focus ${IllustrationContainer} {
    transform: scale(0.95);
  }

  &:active {
    transform: scale(0.95);
  }
`;

type UseCaseOptionProps = {
  heading: string,
  title: string,
  description: string,
  Illu: React$Node,
  onClick: () => void,
};

export function UseCaseOption({ heading, title, description, Illu, onClick }: UseCaseOptionProps) {
  return (
    <UseCaseOptionContainer onClick={onClick}>
      <Text
        mb="8px"
        color="palette.primary.main"
        ff="Inter|Bold"
        fontSize="8px"
        uppercase
        letterSpacing="0.2em"
      >
        {heading}
      </Text>
      <Text mb="8px" color="palette.text.shade100" ff="Inter|SemiBold" fontSize="16px">
        {title}
      </Text>
      <Text mb="8px" color="palette.text.shade100" ff="Inter|Regular" fontSize="13px">
        {description}
      </Text>
      <IllustrationContainer>{Illu}</IllustrationContainer>
    </UseCaseOptionContainer>
  );
}
