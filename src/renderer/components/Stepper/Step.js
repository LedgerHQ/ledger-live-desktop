// @flow

import React from "react";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import IconCheck from "~/renderer/icons/Check";
import IconCross from "~/renderer/icons/Cross";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Status = "next" | "active" | "valid" | "error" | "disable";

const RADIUS = 18;

const Wrapper: ThemedComponent<{ status: Status }> = styled(Box).attrs((p: { status: Status }) => ({
  alignItems: "center",
  color: ["active", "valid"].includes(p.status)
    ? "palette.primary.main"
    : p.status === "error"
    ? "alertRed"
    : "palette.text.shade20",
  grow: true,
  justifyContent: "center",
  relative: true,
}))`
  width: ${RADIUS}px;
  flex-shrink: 0;
  text-align: center;
  font-size: 9px;
`;

const StepNumber = styled(Box).attrs(p => ({
  alignItems: "center",
  justifyContent: "center",
  color: ["active", "valid", "error"].includes(p.status)
    ? "palette.primary.contrastText"
    : "palette.text.shade20",
  bg: ["active", "valid"].includes(p.status)
    ? "palette.primary.main"
    : p.status === "error"
    ? "alertRed"
    : "palette.background.paper",
  ff: "Inter|Bold",
}))`
  border-radius: 50%;
  border: 1px solid
    ${p =>
      ["active", "valid"].includes(p.status)
        ? p.theme.colors.palette.primary.main
        : p.status === "error"
        ? p.theme.colors.alertRed
        : p.theme.colors.palette.text.shade20};
  font-size: 10px;
  height: ${RADIUS}px;
  line-height: 10px;
  transition: all ease-in-out 0.1s ${p => (["active", "valid"].includes(p.status) ? 0.4 : 0)}s;
  width: ${RADIUS}px;
`;

const Label = styled(Box).attrs(() => ({
  fontSize: 3,
  ff: "Inter|Bold",
  px: 2,
}))`
  line-height: 1.2;
  position: absolute;
  top: 25px;
  transition: color ease-in-out 0.1s ${p => (["active", "valid"].includes(p.status) ? 0.4 : 0)}s;
`;

type Props = {
  number: number,
  status: Status,
  children: any,
};

const Step = ({ number, status, children }: Props) => {
  return (
    <Wrapper status={status}>
      <StepNumber status={status}>
        {status === "active" || status === "next" ? (
          number
        ) : status === "valid" ? (
          <IconCheck size={10} />
        ) : (
          <IconCross size={10} />
        )}
      </StepNumber>
      <Label status={status}>{children}</Label>
    </Wrapper>
  );
};

export default Step;
