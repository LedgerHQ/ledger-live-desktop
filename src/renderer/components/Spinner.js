// @flow

import React from "react";
import styled, { keyframes, css } from "styled-components";

import Box from "~/renderer/components/Box";
import IconLoader from "~/renderer/icons/Loader";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const Rotating: ThemedComponent<{ size: number, isRotating?: boolean }> = styled(Box)`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  animation: ${p =>
    p.isRotating === false
      ? "none"
      : css`
          ${rotate} 1s linear infinite
        `};
  transition: 100ms linear transform;
`;

export default function Spinner({ size, ...props }: { size: number, isRotating?: boolean }) {
  return (
    <Rotating {...props} size={size}>
      <IconLoader size={size} />
    </Rotating>
  );
}
