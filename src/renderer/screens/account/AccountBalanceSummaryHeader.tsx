import React from "react";
import { Currency, AccountLike } from "@ledgerhq/live-common/lib/types";
import {
  ValueChange,
  BalanceHistoryWithCountervalue,
} from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { Text, Button, Icons, Flex } from "@ledgerhq/react-ui";
import { BalanceTotal, BalanceDiff } from "~/renderer/components/BalanceInfos";
import FormattedVal from "~/renderer/components/FormattedVal";
import Price from "~/renderer/components/Price";
import PillsDaysCount from "~/renderer/components/PillsDaysCount";
import { NoCountervaluePlaceholder } from "~/renderer/components/CounterValue";

type Props = {
  isAvailable: boolean;
  cryptoChange: ValueChange;
  countervalueChange: ValueChange;
  last: $ElementType<BalanceHistoryWithCountervalue, 0>;
  counterValue: Currency;
  account: AccountLike;
  countervalueFirst: boolean;
  setCountervalueFirst: (arg0: boolean) => void;
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
    <Flex flexDirection="column" width={1}>
      <Flex flexDirection="row" alignItems="center" mb={8}>
        {isAvailable && (
          <Button
            variant="shade"
            outline
            Icon={Icons.BuyCryptoMedium}
            onClick={() => setCountervalueFirst(!countervalueFirst)}
            mr={6}
          />
        )}
        <Text variant="h3" fontWeight="medium" color="palette.neutral.c100">
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
            <Text variant="large" fontWeight="medium" color="palette.neutral.c80">
              <Flex alignItems="center" flexDirection="row" mt="4px">
                {typeof data[1].balance === "number" ? (
                  <FormattedVal
                    key={secondaryKey}
                    animateTicker
                    disableRounding
                    alwaysShowSign={false}
                    unit={data[1].unit}
                    showCode
                    color="palette.neutral.c80"
                    val={data[1].balance}
                  />
                ) : (
                  <NoCountervaluePlaceholder style={{}} />
                )}
                <Price
                  unit={unit}
                  from={currency}
                  withEquality
                  withIcon={false}
                  placeholder={typeof data[1].balance !== "number" ? " " : undefined}
                  renderRaw={({ actualValueFormatted, counterValueFormatted }) => (
                    <span style={{ marginLeft: "5px" }}>
                      {"("}
                      {actualValueFormatted}
                      {" = "}
                      {counterValueFormatted}
                      {")"}
                    </span>
                  )}
                />
              </Flex>
            </Text>
          </BalanceTotal>
        </Text>
      </Flex>
      <Flex
        key={primaryKey}
        flexDirection="row"
        alignItems="center"
        justifyContent={isAvailable ? "space-between" : "flex-end"}
      >
        <Text variant="large" fontWeight="medium">
          <BalanceDiff
            totalBalance={data[0].balance}
            valueChange={data[0].valueChange}
            unit={data[0].unit}
            isAvailable={isAvailable}
            iconSize={12}
          />
        </Text>
        <PillsDaysCount />
      </Flex>
    </Flex>
  );
}
