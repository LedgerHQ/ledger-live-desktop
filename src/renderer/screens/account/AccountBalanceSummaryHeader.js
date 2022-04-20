// @flow

import React from "react";
import styled from "styled-components";
import type { Currency, AccountLike } from "@ledgerhq/live-common/lib/types";
import type {
  ValueChange,
  BalanceHistoryWithCountervalue,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { BalanceTotal, BalanceDiff } from "~/renderer/components/BalanceInfos";
import Box, { Tabbable } from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import Price from "~/renderer/components/Price";
import PillsDaysCount from "~/renderer/components/PillsDaysCount";
import Swap from "~/renderer/icons/Swap";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { NoCountervaluePlaceholder } from "~/renderer/components/CounterValue";

type Props = {
  isAvailable: boolean,
  cryptoChange: ValueChange,
  countervalueChange: ValueChange,
  last: $ElementType<BalanceHistoryWithCountervalue, 0>,
  counterValue: Currency,
  account: AccountLike,
  countervalueFirst: boolean,
  setCountervalueFirst: boolean => void,
};

export default function AccountBalanceSummaryHeader({
  account,
  counterValue,
  isAvailable,
  cryptoChange,
  last,
  countervalueChange,
  countervalueFirst,
  setCountervalueFirst,
}: Props) {
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const cvUnit = counterValue.units[0];
  const data = [
    { valueChange: cryptoChange, balance: last.value, unit },
    { valueChange: countervalueChange, balance: last.countervalue, unit: cvUnit },
  ];
  if (countervalueFirst) {
    data.reverse();
  }

  const primaryKey = data[0].unit.code;
  const secondaryKey = data[1].unit.code;

  return (
    <Box flow={5}>
      <Box horizontal>
        {isAvailable && (
          <SwapButton onClick={() => setCountervalueFirst(!countervalueFirst)}>
            <Swap />
          </SwapButton>
        )}
        <BalanceTotal
          account={account}
          withTransactionsPendingConfirmationWarning
          key={primaryKey}
          style={{
            cursor: isAvailable ? "pointer" : "",
            overflow: "hidden",
            flexShrink: 1,
          }}
          onClick={() => setCountervalueFirst(!countervalueFirst)}
          showCryptoEvenIfNotAvailable
          isAvailable={isAvailable}
          totalBalance={data[0].balance}
          unit={data[0].unit}
        >
          <Wrapper style={{ marginTop: 4 }}>
            <div style={{ width: "auto", marginRight: 20 }}>
              {typeof data[1].balance === "number" ? (
                <FormattedVal
                  key={secondaryKey}
                  animateTicker
                  alwaysShowSign={false}
                  color="warmGrey"
                  unit={data[1].unit}
                  fontSize={6}
                  showCode
                  val={data[1].balance}
                />
              ) : (
                <NoCountervaluePlaceholder style={{}} />
              )}
            </div>
            <Price
              unit={unit}
              from={currency}
              withActivityCurrencyColor
              withEquality
              color="warmGrey"
              fontSize={6}
              iconSize={16}
              placeholder={typeof data[1].balance !== "number" ? " " : undefined}
            />
          </Wrapper>
        </BalanceTotal>
      </Box>
      <Box
        key={primaryKey}
        horizontal
        alignItems="center"
        justifyContent={isAvailable ? "space-between" : "flex-end"}
        flow={7}
      >
        <BalanceDiff
          totalBalance={data[0].balance}
          valueChange={data[0].valueChange}
          unit={data[0].unit}
          isAvailable={isAvailable}
        />
        <PillsDaysCount />
      </Box>
    </Box>
  );
}

const Wrapper: ThemedComponent<{}> = styled(Box)`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

const SwapButton: ThemedComponent<{}> = styled(Tabbable).attrs(() => ({
  color: "palette.text.shade100",
  ff: "Inter",
  fontSize: 7,
}))`
  align-items: center;
  align-self: center;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  color: ${p => p.theme.colors.palette.text.shade20};
  cursor: pointer;
  display: flex;
  height: 53px;
  justify-content: center;
  margin-right: 16px;
  width: 25px;

  &:hover {
    border-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    opacity: 0.5;
  }
`;
