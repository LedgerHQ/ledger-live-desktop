import React, { PureComponent } from "react";
import styled from "styled-components";
import { Operation } from "@ledgerhq/live-common/lib/types";
import { Flex, Text } from "@ledgerhq/react-ui";
import { TFunction } from "react-i18next";
import Box from "~/renderer/components/Box";
import OperationDate from "./OperationDate";

const Cell = styled(Box).attrs(() => ({
  horizontal: false,
  px: 6,
}))`
  width: auto;
  min-width: ${p => (p.compact ? 90 : 120)}px;
`;

type Props = {
  t: TFunction;
  operation: Operation;
  text?: string;
  compact?: boolean;
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
        <Flex {...ellipsis}>
          <Text variant="body" fontWeight="medium" color="palette.neutral.c100">
            {text ||
              t(
                operation.hasFailed
                  ? "operationDetails.failed"
                  : `operation.type.${operation.type}`,
              )}
          </Text>
        </Flex>
        <OperationDate date={operation.date} />
      </Cell>
    );
  }
}

export default DateCell;
