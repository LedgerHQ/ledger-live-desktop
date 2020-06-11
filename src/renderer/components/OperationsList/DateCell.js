// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import type { Operation } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import Box from "~/renderer/components/Box";
import OperationDate from "./OperationDate";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Cell: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 3,
  horizontal: false,
}))`
  width: auto;
  min-width: ${p => (p.compact ? 90 : 120)}px;
`;

type Props = {
  t: TFunction,
  operation: Operation,
  text?: string,
  compact?: boolean,
};

class DateCell extends PureComponent<Props> {
  static defaultProps = {
    withAccount: false,
  };

  render() {
    const { t, operation, compact, text } = this.props;
    const ellipsis = {
      display: "block",
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap",
    };

    return (
      <Cell compact={compact}>
        <Box ff="Inter|SemiBold" fontSize={3} color="palette.text.shade80" style={ellipsis}>
          {text ||
            t(operation.hasFailed ? "operationDetails.failed" : `operation.type.${operation.type}`)}
        </Box>
        <OperationDate date={operation.date} />
      </Cell>
    );
  }
}

export default DateCell;
