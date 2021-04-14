// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { rgba } from "~/renderer/styles/helpers";
import Card from "~/renderer/components/Box/Card";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ToolTip from "./Tooltip";
import InfoCircle from "../icons/InfoCircle";

const TableContainer: ThemedComponent<*> = styled(Card)`
  border-radius: 4px;
  overflow: hidden;
`;

const TableHeaderRow: ThemedComponent<*> = styled(Box).attrs(() => ({
  flex: 1,
  py: 3,
  px: 4,
  horizontal: true,
  justifyContent: "space-between",
  alignItems: "center",
  alignContent: "center",
}))`
  border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

export const HeaderWrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => rgba(p.theme.colors.palette.secondary.main, 0.02)};
`;

const TableHeaderTitle: ThemedComponent<*> = styled(Text).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter|Medium",
}))`
  font-size: 14px;
`;

export const TableRow: ThemedComponent<{}> = styled(Box)`
  align-items: center;
  flex-direction: row;
  color: #abadb6;
  cursor: pointer;
  display: flex;
  padding: 20px;
  :hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`;

type TableHeaderProps = {
  title?: React$Node,
  children?: React$Node,
  titleProps?: *,
  tooltip?: React$Node,
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
