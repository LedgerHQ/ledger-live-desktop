// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";

const Wrapper: ThemedComponent<{}> = styled("div")`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 20px;
  // background-color: ${p => p.theme.colors.palette.background.default};
  color: ${p => console.log(p)};
  background-color: ${p => p.theme.colors.palette.background.default};
  z-index: 44;
  overflow: hidden;
  border-radius: 4px;
`;

const Activity: ThemedComponent<{}> = styled("div")`
  position: absolute;
  left: -45%;
  height: 100%;
  width: 60%;
  background-image: linear-gradient(
    to left,
    ${p => rgba(p.theme.colors.palette.background.paper, 0.1)},
    ${p => rgba(p.theme.colors.palette.background.paper, 0.3)},
    ${p => rgba(p.theme.colors.palette.background.paper, 0.5)},
    ${p => rgba(p.theme.colors.palette.background.paper, 0.3)},
    ${p => rgba(p.theme.colors.palette.background.paper, 0.1)}
  );
  animation: loading 0.8s infinite;
  z-index: 45;
  @keyframes loading {
    0% {
      left: -45%;
    }
    100% {
      left: 100%;
    }
  }
`;

function LoadingPlaceholder({ style }: { style?: any }) {
  return (
    <Wrapper style={style}>
      <Activity />
    </Wrapper>
  );
}

export default LoadingPlaceholder;
