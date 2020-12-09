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

const DeviceSelectOptionContainer: ThemedComponent<*> = styled.button`
  border: none;
  outline: none;
  width: 152px;
  height: 318px;
  background-color: rgba(100, 144, 241, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform ease-out 100ms;

  &:hover ${DeviceIllustrationContainer} {
    transform: translateX(0px);
  }

  &:active {
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
};

export function DeviceSelectorOption({ label, Illu, onClick }: DeviceSelectOptionProps) {
  return (
    <DeviceSelectOptionContainer onClick={onClick}>
      <Text mt={"32px"} color="palette.text.shade100" ff="Inter|SemiBold" fontSize={"22px"}>
        {label}
      </Text>
      <DeviceIllustrationContainer>{Illu}</DeviceIllustrationContainer>
    </DeviceSelectOptionContainer>
  );
}
