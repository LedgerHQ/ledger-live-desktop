import React from "react";
import styled from "styled-components";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";
import { Text } from "@ledgerhq/react-ui";

const HeaderText = styled(Text).attrs(() => ({ ff: "Inter|Medium", fontSize: "12px" }))`
  color: ${p => p.theme.colors.palette.neutral.c80};
`;

const HeaderTextSeparator = styled.div`
  width: 2.36px;
  height: 2.36px;
  left: 47.67px;
  top: 5.83px;
  margin: 0px 8px;
  background: ${p => p.theme.colors.palette.neutral.c80};
  transform: rotate(45deg);
`;

export type ProgressHeaderProps = {
  title: string;
  stepIndex: number;
  stepCount: number;
};

const ProgressHeader = ({ title, stepIndex, stepCount }: ProgressHeaderProps) => (
  <FlexBox flexDirection="row" alignItems="center" mb="32px">
    <HeaderText>{title}</HeaderText>
    <HeaderTextSeparator />
    <HeaderText>
      {stepIndex + 1}/{stepCount}
    </HeaderText>
  </FlexBox>
);

export default ProgressHeader;
