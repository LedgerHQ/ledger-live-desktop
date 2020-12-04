// @flow

import styled from "styled-components";

export const WaveContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 500px;
`;

export const HeaderContainer = styled.div`
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  top: 0px;
  right: 0px;
  left: 0px;
  padding: 40px 80px;
`;

export const Illustration = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: url(${({ src }) => src}) no-repeat center;
  margin: auto;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 576px;
  width: 100%;
  z-index: 1;
`;
