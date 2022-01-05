// @flow
import { BigNumber } from "bignumber.js";
import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getOperationAmountNumber } from "@ledgerhq/live-common/lib/operation";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { useCalculate } from "@ledgerhq/live-common/lib/countervalues/react";
import type { Account, AccountLike, Operation } from "@ledgerhq/live-common/lib/types";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import FormattedDate from "~/renderer/components/FormattedDate";
import { B, OpDetailsData, OpDetailsSection, OpDetailsTitle } from "./styledComponents";
import { NoCountervaluePlaceholder } from "~/renderer/components/CounterValue";

const Column = styled(Box).attrs(() => ({
  justifyContent: "flex-start",
  alignItems: "flex-start",
}))`
  margin-bottom: 15px;
`;

const Title = styled(Text).attrs(() => ({
  fontSize: 4,
  fontWeight: 600,
  color: "palette.text.shade100",
}))`
  line-height: 18px;
`;

const Subtitle = styled(Text).attrs(() => ({
  fontSize: 2,
  color: "palette.text.shade60",
}))`
  line-height: 12px;
`;

type Props = {
  operation: Operation,
  account: AccountLike,
  parentAccount: Account,
};

export default function AmountDetails({ operation, account }: Props) {
  const { date } = operation;
  const compareDate = useMemo(() => new Date(), []);
  const currency = getAccountCurrency(account);

  const amount = getOperationAmountNumber(operation);

  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const unit = counterValueCurrency.units[0];
  const valueNumber = amount.toNumber();
  const countervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value: valueNumber,
    disableRounding: true,
    date,
  });

  const compareCountervalue = useCalculate({
    from: currency,
    to: counterValueCurrency,
    value: valueNumber,
    disableRounding: true,
    date: compareDate,
  });

  const val = countervalue && BigNumber(countervalue);
  const compareVal = compareCountervalue && BigNumber(compareCountervalue);

  return (
    <Box flow={3} px={20} mt={20}>
      <Text fontSize={7} ff="Inter|SemiBold">
        <Trans i18nKey="operationDetails.amount" />
      </Text>
      <B />
      <OpDetailsSection>
        <OpDetailsTitle>
          <Column mr={2}>
            <Title>
              <Trans i18nKey={"calendar.transactionDate"} />
            </Title>
            <Subtitle>
              <FormattedDate date={date} format="L" />
            </Subtitle>
          </Column>
        </OpDetailsTitle>
        <OpDetailsData>
          <Box>
            {val ? (
              <FormattedVal
                fontSize={4}
                fontWeight={600}
                val={val}
                currency={currency}
                unit={unit}
                showCode
                alwaysShowSign
                color="palette.text.shade60"
              />
            ) : (
              <NoCountervaluePlaceholder />
            )}
          </Box>
        </OpDetailsData>
      </OpDetailsSection>

      <OpDetailsSection>
        <OpDetailsTitle>
          <Column mr={2}>
            <Title>
              <Trans i18nKey={"operationDetails.currentValue"} />
            </Title>
            <Subtitle>
              <FormattedDate date={compareDate} format="L" />
            </Subtitle>
          </Column>
        </OpDetailsTitle>
        <OpDetailsData>
          <Box>
            {compareVal ? (
              <FormattedVal
                fontSize={4}
                fontWeight={600}
                val={compareVal}
                currency={currency}
                unit={unit}
                showCode
                alwaysShowSign
                color="palette.text.shade60"
              />
            ) : (
              <NoCountervaluePlaceholder />
            )}
          </Box>
        </OpDetailsData>
      </OpDetailsSection>
    </Box>
  );
}
