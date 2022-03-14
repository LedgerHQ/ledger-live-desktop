import React from "react";
import styled, { keyframes } from "styled-components";

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 20px;
  overflow: hidden;
  border-radius: 4px;
`;

const loading = keyframes`
{
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;

const Activity = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-image: linear-gradient(
    to left,
    transparent,
    ${p => p.theme.colors.background.main},
    transparent
  );
  animation: ${loading} 0.8s infinite;
`;

function LoadingPlaceholder({ style }: { style?: any }) {
  return (
    <Wrapper data-test-id="loading-placeholder" style={style}>
      <Activity />
    </Wrapper>
  );
}

export default LoadingPlaceholder;
