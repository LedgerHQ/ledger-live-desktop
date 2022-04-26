import React, { PureComponent } from "react";
import styled from "styled-components";
import { getOperationAmountNumber } from "@ledgerhq/live-common/lib/operation";
import { Currency, Unit, Operation } from "@ledgerhq/live-common/lib/types";
import { Text } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import CounterValue from "~/renderer/components/CounterValue";
import FormattedVal from "~/renderer/components/FormattedVal";

import perFamilyOperationDetails from "~/renderer/generated/operationDetails";

const Cell = styled(Box).attrs(() => ({
  pl: 4,
  horizontal: false,
  alignItems: "flex-end",
}))`
  flex: 0 0 auto;
  text-align: right;
  justify-content: center;
  min-width: 150px;
`;

type Props = {
  operation: Operation;
  currency: Currency;
  unit: Unit;
};

class AmountCell extends PureComponent<Props> {
  render() {
    // eslint-disable-next-line no-unused-vars
    const { currency, unit, operation } = this.props;
    const amount = getOperationAmountNumber(operation);

    // $FlowFixMe
    const specific = currency.family ? perFamilyOperationDetails[currency.family] : null;

    const Element =
      specific && specific.amountCellExtra ? specific.amountCellExtra[operation.type] : null;
    const AmountElement =
      specific && specific.amountCell ? specific.amountCell[operation.type] : null;

    return (
      <>
        {Element && (
          <Cell>
            <Element operation={operation} unit={unit} currency={currency} />
          </Cell>
        )}
        {!amount.isZero() && (
          <Cell>
            {AmountElement ? (
              <AmountElement
                amount={amount}
                operation={operation}
                unit={unit}
                currency={currency}
              />
            ) : (
              <>
                <Text variant="paragraph" fontWeight="medium">
                  <FormattedVal
                    val={amount}
                    unit={unit}
                    showCode
                    alwaysShowSign
                    color={amount.isNegative() ? "palette.neutral.c100" : undefined}
                  />
                </Text>
                <Text variant="small" fontWeight="medium">
                  <CounterValue
                    color="palette.neutral.c80"
                    alwaysShowSign
                    date={operation.date}
                    currency={currency}
                    value={amount}
                  />
                </Text>
              </>
            )}
          </Cell>
        )}
      </>
    );
  }
}

export default AmountCell;
