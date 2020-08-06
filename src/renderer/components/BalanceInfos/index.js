// @flow

import React from "react";
import type { BigNumber } from "bignumber.js";
import styled from "styled-components";

import type { Unit, ValueChange, AccountLike } from "@ledgerhq/live-common/lib/types";
import type { TFunction } from "react-i18next";
import { useSelector } from "react-redux";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";

import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import PillsDaysCount from "~/renderer/components/PillsDaysCount";
import TransactionsPendingConfirmationWarning from "~/renderer/components/TransactionsPendingConfirmationWarning";
import { PlaceholderLine } from "./Placeholder";

const Sub = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
}))`
  text-transform: lowercase;
`;

type BalanceSinceProps = {
  since: string,
  valueChange: ValueChange,
  totalBalance: BigNumber,
  isAvailable: boolean,
  t: TFunction,
};

type BalanceTotalProps = {
  children?: any,
  unit: Unit,
  isAvailable: boolean,
  totalBalance: BigNumber,
  showCryptoEvenIfNotAvailable?: boolean,
  account?: AccountLike,
  withTransactionsPendingConfirmationWarning?: boolean,
};

type Props = {
  unit: Unit,
} & BalanceSinceProps;

type BalanceInfoProps = Props & {
  handleChangeSelectedTime: any => void,
};

export function BalanceDiff(props: Props) {
  const { t, totalBalance, valueChange, since, unit, isAvailable, ...otherProps } = props;

  if (!isAvailable) return null;

  return (
    <Box horizontal {...otherProps}>
      <Box horizontal alignItems="center" style={{ lineHeight: 1.2, fontSize: 20 }}>
        {valueChange.percentage && (
          <FormattedVal
            isPercent
            animateTicker
            val={valueChange.percentage.times(100).integerValue()}
            inline
            withIcon
          />
        )}
        <FormattedVal
          unit={unit}
          val={valueChange.value}
          prefix={valueChange.percentage ? " (" : undefined}
          suffix={valueChange.percentage ? ")" : undefined}
          withIcon={!valueChange.percentage}
          alwaysShowSign={!!valueChange.percentage}
          showCode
          animateTicker
          inline
        />
      </Box>
    </Box>
  );
}

export function BalanceTotal(props: BalanceTotalProps) {
  const {
    unit,
    totalBalance,
    isAvailable,
    showCryptoEvenIfNotAvailable,
    children,
    withTransactionsPendingConfirmationWarning,
    account,
  } = props;
  const counterValueCurrency = useSelector(counterValueCurrencySelector);
  const showAllDigits = counterValueCurrency.type === "FiatCurrency";

  return (
    <Box horizontal grow shrink>
      <Box {...props}>
        <Box horizontal>
          {!isAvailable && !showCryptoEvenIfNotAvailable ? (
            <PlaceholderLine width={150} />
          ) : (
            <FormattedVal
              inline
              animateTicker
              color="palette.text.shade100"
              unit={unit}
              fontSize={8}
              disableRounding
              showAllDigits={showAllDigits}
              showCode
              val={totalBalance}
            />
          )}
          {withTransactionsPendingConfirmationWarning ? (
            <TransactionsPendingConfirmationWarning maybeAccount={account} />
          ) : null}
        </Box>
        {isAvailable && children}
      </Box>
    </Box>
  );
}

BalanceTotal.defaultProps = {
  children: null,
  unit: undefined,
};

function BalanceInfos(props: BalanceInfoProps) {
  const {
    t,
    totalBalance,
    since,
    handleChangeSelectedTime,
    valueChange,
    isAvailable,
    unit,
  } = props;

  return (
    <Box flow={5}>
      <Box horizontal>
        <BalanceTotal
          withTransactionsPendingConfirmationWarning
          unit={unit}
          isAvailable={isAvailable}
          totalBalance={totalBalance}
        >
          <Sub>{t("dashboard.totalBalance")}</Sub>
        </BalanceTotal>
      </Box>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <BalanceDiff
          t={t}
          totalBalance={totalBalance}
          valueChange={valueChange}
          since={since}
          unit={unit}
          isAvailable={isAvailable}
        />
        <PillsDaysCount selected={since} onChange={handleChangeSelectedTime} />
      </Box>
    </Box>
  );
}

export default BalanceInfos;
