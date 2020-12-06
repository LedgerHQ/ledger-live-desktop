// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Wrapper: ThemedComponent<{}> = styled.div`
  background-color: ${p => p.theme.colors.palette.text.shade50};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const Bar: ThemedComponent<{}> = styled.div`
  width: ${p => p.progress}%;
  height: 100%;
  background-color: ${p => p.theme.colors.identity};
`;

const Overlay: ThemedComponent<{}> = styled.div`
  position: absolute;
  width: 34%;
  height: 100%;
  border: 0 solid ${p => p.theme.colors.palette.primary.main};
  border-width: 0 2px 0 2px;
  margin: auto;
  position: absolute;
  left: 0;
  right: 0;
`;
const ProgressBar = ({
  progress,
  width = "100%",
  withDividers = false,
}: {
  progress: number,
  width?: number,
  withDividers?: boolean,
}) => (
  <Wrapper style={{ width }}>
    {withDividers ? <Overlay /> : null}
    <Bar progress={progress} />
  </Wrapper>
);

export default ProgressBar;
