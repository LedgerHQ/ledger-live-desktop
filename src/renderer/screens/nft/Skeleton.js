// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { Card } from "~/renderer/components/Box";

type Props = {
  width?: number,
  height?: number,
  mt?: any,
  status?: "loading" | "loaded",
  children?: React$Node,
};

const Wrapper: ThemedComponent<{}> = styled(Card)`
  border-radius: 4px;
  background: red;
  width: "100%";
  aspect-ratio: 1 / 1;
  display: inline-block;
  position: relative;
  overflow: hidden;
  background: hsla(207, 44%, 14%, 0.1);

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background: linear-gradient(to left, #fff0, #fff4 50%, #fff0 100%);
    animation: shimmer 2s infinite;
    content: "";
  }

  @keyframes shimmer {
    30% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

const Skeleton = ({ width, height, children, status, mt }: Props) => {
  return (
    <Wrapper width={width} height={height} mt={mt}>
      {children}
    </Wrapper>
  );
};

export default Skeleton;
