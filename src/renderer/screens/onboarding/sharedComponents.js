// @flow
import React from "react";
import styled from "styled-components";
import { radii } from "~/renderer/styles/theme";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import GrowScroll from "~/renderer/components/GrowScroll";
import OptionRow from "~/renderer/components/OptionRow";
import IconSensitiveOperationShield from "~/renderer/icons/SensitiveOperationShield";

// GENERAL
export const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  fontSize: 7,
  color: "palette.text.shade100",
  "data-automation-id": "page-title",
}))`
  max-width: 550px;
  text-align: center;
  transition: color ease-out 300ms;
  transition-delay: 300ms;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export const StepContainerInner: ThemedComponent<{}> = styled(GrowScroll).attrs(() => ({
  pb: 6,
  alignItems: "center",
}))``;

export const Description: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 5,
  lineHeight: 1.5,
  textAlign: "center",
  color: "palette.text.shade60",
}))`
  transition: color ease-out 300ms;
  transition-delay: 300ms;
  margin: 10px auto 25px;
  max-width: 480px;
`;

export const Inner: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  grow: true,
  flow: 4,
}))``;

export const FixedTopContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  sticky: true,
  mt: 170,
}))``;
// FOOTER

export const OnboardingFooterWrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 5,
  py: 3,
  horizontal: true,
}))`
  border-top: 2px solid ${p => p.theme.colors.palette.divider};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
  justify-content: space-between;
`;

// INSTRUCTION LIST

export const DisclaimerBox = ({ disclaimerNotes, ...p }: { disclaimerNotes: any }) => {
  return (
    <DisclaimerBoxContainer {...p}>
      <Box m={3} relative>
        <DisclaimerBoxIconContainer>
          <IconSensitiveOperationShield />
        </DisclaimerBoxIconContainer>
        {disclaimerNotes.map(note => (
          <OptionRow justifyContent="center" key={note.key} step={note} />
        ))}
      </Box>
    </DisclaimerBoxContainer>
  );
};

// Not enough styled as a warning
export const DisclaimerBoxContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  shrink: 1,
  grow: true,
  borderRadius: "4px",
  bg: "palette.background.default",
}))`
  min-width: 620px;
  border: 1px dashed ${p => p.theme.colors.palette.divider};
`;
export const DisclaimerBoxIconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  color: p.theme.colors.alertRed,
}))`
  position: absolute;
  top: 0;
  right: 0;
`;

// GENUINE CHECK
export const GenuineCheckCardWrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  p: 5,
  borderRadius: "4px",
  justifyContent: "flex-start",
}))`
  width: 580px;
  transition: all ease-in-out 0.2s;
  color: ${p =>
    p.isDisabled ? p.theme.colors.palette.text.shade60 : p.theme.colors.palette.text.shade100};
  border: ${p =>
    `1px ${p.isDisabled ? "dashed" : "solid"} ${
      p.isError ? p.theme.colors.alertRed : p.theme.colors.palette.divider
    }`};
  pointer-events: ${p => (p.isDisabled ? "none" : "auto")};
  background-color: ${p =>
    p.isDisabled
      ? p.theme.colors.palette.background.default
      : p.theme.colors.palette.background.paper};
  opacity: ${p => (p.isDisabled ? 0.7 : 1)};
  &:hover {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.05);
  }
  align-items: center;
  > :nth-child(3) {
    flex-grow: 1;
    justify-content: flex-end;
  }
`;
