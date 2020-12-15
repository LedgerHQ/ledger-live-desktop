// @flow

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Text from "~/renderer/components/Text";

const DeviceIllustrationContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateX(8px);
  transition: transform ease-out 150ms;
  will-change: transform;
  display: flex;
`;

const Container = styled.div`
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  background-color: rgba(100, 144, 241, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform ease-out 100ms;
  animation: ${p => p.theme.animations.fadeIn};
`;

const DeviceSelectOptionContainer: ThemedComponent<{}> = styled.button`
  border: none;
  outline: none;
  width: 152px;
  height: 318px;
  background-color: transparent;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover ${DeviceIllustrationContainer} {
    transform: translateX(0px);
  }

  &:active ${Container} {
    transform: scale(0.95);
  }

  &:focus ${DeviceIllustrationContainer} {
    transform: translateX(0px);
  }
`;

type DeviceSelectOptionProps = {
  label: string,
  Illu: React$Node,
  onClick: () => void,
  id: string,
};

export function DeviceSelectorOption({ label, Illu, onClick, id }: DeviceSelectOptionProps) {
  return (
    <DeviceSelectOptionContainer id={id} onClick={onClick}>
      <Container>
        <Text mt={"32px"} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={"22px"}>
          {label}
        </Text>
        <DeviceIllustrationContainer>{Illu}</DeviceIllustrationContainer>
      </Container>
    </DeviceSelectOptionContainer>
  );
}
