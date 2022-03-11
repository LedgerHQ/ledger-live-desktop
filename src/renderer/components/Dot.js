// @flow
import styled, { keyframes, css } from "styled-components";
import { colors } from "~/renderer/styles/theme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const collapseAnim = keyframes`
  0% {
    opacity: 0;
    top: -5px;
    right: -5px;
    transform: translateY(0);
  }
  100% {
    opacity: 1;
    top: -5px;
    right: -5px;
    transform: translateY(0);
  }
`;

const openAnim = keyframes`
  0% {
    opacity: 0;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
  100% {
    opacity: 1;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
  }
`;

export const Dot: ThemedComponent<{
  color?: string,
  opacity?: number,
  collapsed?: ?boolean,
}> = styled.div`
  background-color: ${p => p.color || colors.wallet};
  opacity: ${p => p.opacity};
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -5px;
  transform: translateY(0);
  opacity: 0;
  width: 10px;
  height: 10px;
  animation: ${p =>
      p.collapsed
        ? css`
            ${collapseAnim}
          `
        : css`
            ${openAnim}
          `}
    200ms 500ms ease forwards;
`;
