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

const Container = styled.div`
  width: 100%;
  padding: 24px;
  box-sizing: border-box;
  background-color: #8a80db20;
  border-radius: 4px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: transform 100ms ease-in-out;
  text-align: left;
`;

const UseCaseOptionContainer: ThemedComponent<*> = styled.button`
  border: none;
  outline: none;
  width: 272px;
  box-sizing: border-box;
  background-color: transparent;
  position: relative;
  cursor: pointer;

  &:hover ${IllustrationContainer} {
    transform: scale(0.95);
  }

  &:focus ${IllustrationContainer} {
    transform: scale(0.95);
  }

  &:active ${Container} {
    transform: scale(0.95);
  }
`;

type UseCaseOptionProps = {
  heading: React$Node,
  title: React$Node,
  description: React$Node,
  Illu: React$Node,
  onClick: () => void,
  id?: string,
  dataTestId?: string,
};

export function UseCaseOption({
  heading,
  title,
  description,
  Illu,
  onClick,
  dataTestId,
}: UseCaseOptionProps) {
  return (
    <UseCaseOptionContainer data-test-id={dataTestId} onClick={onClick}>
      <Container>
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
      </Container>
    </UseCaseOptionContainer>
  );
}
