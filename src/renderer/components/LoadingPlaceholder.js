// @flow
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 20px;
  background-color: ${p => p.theme.colors.palette.action.active};
  z-index: 44;
  overflow: hidden;
  border-radius: 4px;
`;

const Activity = styled.div`
  position: absolute;
  left: -45%;
  height: 100%;
  width: 45%;
  background-image: linear-gradient(
    to left,
    ${p => p.theme.colors.palette.text.shade5},
    ${p => p.theme.colors.palette.text.shade10},
    ${p => p.theme.colors.palette.text.shade30},
    ${p => p.theme.colors.palette.text.shade10},
    ${p => p.theme.colors.palette.text.shade5}
  );
  animation: loading 1s infinite;
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
