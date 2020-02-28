// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { getOperationAmountNumber } from "@ledgerhq/live-common/lib/operation";
import type { Currency, Unit, Operation } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Cell: ThemedComponent<{}> = styled(Box).attrs(() => ({
  px: 4,
  horizontal: false,
  alignItems: "flex-end",
}))`
  flex: 0.5;
  width: 150px;
  text-align: right;
  justify-content: space-between;
  height: 32px;
`;

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

class AmountCell extends PureComponent<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { currency, unit, operation } = this.props;
    const amount = getOperationAmountNumber(operation);

    return (
      <Cell>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          alwaysShowSign
          color={amount.isNegative() ? "palette.text.shade80" : undefined}
        />
        <CounterValue
          color="palette.text.shade60"
          fontSize={3}
          alwaysShowSign
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </Cell>
    );
  }
}

export default AmountCell;
