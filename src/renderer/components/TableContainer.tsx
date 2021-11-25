import React from "react";
import styled from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import { Flex, Text } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import ToolTip from "./Tooltip";
import InfoCircle from "../icons/InfoCircle";

const TableContainer = styled(Flex).attrs(() => ({
  flexDirection: "column",
  overflow: "hidden",
}))``;

const TableHeaderRow = styled(Flex).attrs(() => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  alignContent: "center",
  mb: 8,
}))``;

export const HeaderWrapper = styled(Flex).attrs(() => ({
  flexDirection: "row",
  padding: 5,
  backgroundColor: "palette.neutral.c30",
}))`
  border-radius: 4px;
`;

const TableHeaderTitle = styled(Text).attrs(() => ({
  color: "palette.neutral.c100",
  variant: "h5",
  fontSize: "20px", // for some unknown reason h5 is overriden/not applied to fontSize
}))``;

export const TableRow = styled(Flex).attrs(() => ({
  flexDirection: "row",
  alignItems: "center",
  color: "#abadb6",
  cursor: "pointer",
  padding: "20px",
}))`
  :hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`;

type TableHeaderProps = {
  title?: React$Node;
  children?: React$Node;
  titleProps?: any;
  tooltip?: React$Node;
};

const TableHeaderTooltip = ({ tooltip, title, titleProps }: TableHeaderProps) =>
  tooltip ? (
    <ToolTip content={tooltip}>
      <Box horizontal alignItems="center">
        <TableHeaderTitle {...titleProps}>{title}</TableHeaderTitle>
        &nbsp;
        <InfoCircle size={16} />
      </Box>
    </ToolTip>
  ) : null;

export const TableHeader = ({ title, children, titleProps, tooltip }: TableHeaderProps) => {
  return (
    <TableHeaderRow>
      {title ? (
        tooltip ? (
          <TableHeaderTooltip title={title} tooltip={tooltip} titleProps={titleProps} />
        ) : (
          <TableHeaderTitle {...titleProps}>{title}</TableHeaderTitle>
        )
      ) : null}
      {children ? <Box horizontal>{children}</Box> : null}
    </TableHeaderRow>
  );
};

export default TableContainer;
