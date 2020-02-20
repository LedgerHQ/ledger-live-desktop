// @flow

import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const DisclaimerBoxContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  shrink: 1,
  grow: true,
  p: 3,
  borderRadius: "4px",
  bg: "palette.background.default",
}))`
  min-width: 620px;
  border: 1px dashed ${p => p.theme.colors.palette.divider};
`;
const DisclaimerBoxIconContainer = styled(Box).attrs(p => ({
  color: p.theme.colors.alertRed,
}))``;

const DisclaimerText = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  shrink: 1,
  grow: true,
  fontSize: 3,
}))`
  padding-left: 15px;
  max-width: 100%;
  color: ${p => p.theme.colors.palette.text.shade80};
`;

const DisclaimerBox = ({ icon, content, ...p }: { icon: React$Node, content: React$Node }) => (
  <DisclaimerBoxContainer {...p}>
    <Box m={2} horizontal alignItems="center" justifyContent="center">
      <DisclaimerBoxIconContainer>{icon}</DisclaimerBoxIconContainer>
      <DisclaimerText>{content}</DisclaimerText>
    </Box>
  </DisclaimerBoxContainer>
);

export default DisclaimerBox;
