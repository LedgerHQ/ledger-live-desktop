import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  width: ${p => p.percentage}%;
  background-color: ${p => p.theme.colors.palette.neutral.c100};
  transition: width ease-out 200ms;
`;

const ProgressBar = ({ stepIndex, stepCount }) => {
  return <Bar percentage={100 * ((stepIndex + 1) / stepCount)} />;
};

export default ProgressBar;
