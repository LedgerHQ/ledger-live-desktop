// @flow
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const WaveContainer: ThemedComponent<*> = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 500px;
`;

export const HeaderContainer: ThemedComponent<*> = styled.div`
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

export const Illustration: ThemedComponent<*> = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background: url(${({ src }) => src}) no-repeat center;
  margin: 0 auto;
`;

export const ContentContainer: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 576px;
  width: 100%;
  z-index: 1;
`;
