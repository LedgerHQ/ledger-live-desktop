// @flow
import React from "react";
import type { BigNumber } from "bignumber.js";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import type { Unit, ValueChange, AccountLike } from "@ledgerhq/live-common/lib/types";
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

export function BalanceDiff({
  totalBalance,
  valueChange,
  since,
  unit,
  isAvailable,
  ...boxProps
}: Props) {
  if (!isAvailable) return null;

  return (
    <Box horizontal {...boxProps}>
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

export function BalanceTotal({
  unit,
  totalBalance,
  isAvailable,
  showCryptoEvenIfNotAvailable,
  children,
  withTransactionsPendingConfirmationWarning,
  account,
  ...boxProps
}: BalanceTotalProps) {
  return (
    <Box horizontal grow shrink>
      <Box {...boxProps}>
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

export default function BalanceInfos({
  totalBalance,
  since,
  handleChangeSelectedTime,
  valueChange,
  isAvailable,
  unit,
}: BalanceInfoProps) {
  const { t } = useTranslation();

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
