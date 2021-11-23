import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Unit, AccountLike } from "@ledgerhq/live-common/lib/types";
import { ValueChange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Text } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import FormattedVal from "~/renderer/components/FormattedVal";
import PillsDaysCount from "~/renderer/components/PillsDaysCount";
import TransactionsPendingConfirmationWarning from "~/renderer/components/TransactionsPendingConfirmationWarning";
import { PlaceholderLine } from "./Placeholder";

type BalanceSinceProps = {
  valueChange: ValueChange;
  totalBalance: number;
  isAvailable: boolean;
  iconSize?: number;
};

type BalanceTotalProps = {
  children?: any;
  unit?: Unit;
  isAvailable: boolean;
  totalBalance: number;
  showCryptoEvenIfNotAvailable?: boolean;
  account?: AccountLike;
  withTransactionsPendingConfirmationWarning?: boolean;
};

type Props = {
  unit: Unit;
} & BalanceSinceProps;

export function BalanceDiff({
  totalBalance,
  valueChange,
  unit,
  isAvailable,
  iconSize,
  ...boxProps
}: Props) {
  if (!isAvailable) return null;

  return (
    <Box horizontal {...boxProps}>
      <Box horizontal alignItems="center">
        {typeof valueChange.percentage === "number" && (
          <FormattedVal
            isPercent
            animateTicker
            val={Math.round(valueChange.percentage * 100)}
            inline
            withIcon
            iconSize={iconSize}
          />
        )}
        <FormattedVal
          unit={unit}
          val={valueChange.value}
          prefix={valueChange.percentage ? " (" : undefined}
          suffix={valueChange.percentage ? ")" : undefined}
          withIcon={!valueChange.percentage}
          iconSize={iconSize}
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
  children = null,
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
        {(isAvailable || showCryptoEvenIfNotAvailable) && children}
      </Box>
    </Box>
  );
}

export default function BalanceInfos({ totalBalance, valueChange, isAvailable, unit }: Props) {
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
          unit={unit}
          isAvailable={isAvailable}
        />
        <PillsDaysCount />
      </Box>
    </Box>
  );
}

const Sub = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 4,
}))`
  text-transform: lowercase;
`;
