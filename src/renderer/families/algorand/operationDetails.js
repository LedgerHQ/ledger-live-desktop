/* eslint-disable consistent-return */
// @flow
import { BigNumber } from "bignumber.js";
import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { Currency, Unit, Operation, Account } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { TFunction } from "react-i18next";
import {
  OpDetailsTitle,
  OpDetailsData,
  B,
} from "~/renderer/modals/OperationDetails/styledComponents";
import { useDiscreetMode } from "~/renderer/components/Discreet";
import { localeSelector } from "~/renderer/reducers/settings";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import ToolTip from "~/renderer/components/Tooltip";
import ConfirmationCheck, {
  Container,
} from "~/renderer/components/OperationsList/ConfirmationCheck";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import Box from "~/renderer/components/Box/Box";

const CellIcon = styled(Box)`
  flex: 1 0 50%;
  overflow: visible;
  z-index: ${p => p.index};
  transform: translateX(-50%);
`;

const Spacer = styled(Box)`
  flex: 1 0 0%;
  transition all .2s ease-in-out;
`;

const Cell: ThemedComponent<{}> = styled(Box).attrs(() => ({
  pl: 4,
  horizontal: true,
  alignItems: "center",
  justifyContent: "center",
  width: 24,
}))`
  box-sizing: content-box;
  &:hover {
    ${Spacer} {
      flex: 1.5 0 33%;
    }
  }
`;

const ConfirmationCellContainer = styled(Container)``;

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  const unit = getAccountUnit(account);
  const currency = getAccountCurrency(account);

  return (
    <>
      {extra.rewards && extra.rewards.gt(0) && (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.rewards"} />
            </OpDetailsTitle>
            <FormattedVal unit={unit} showCode val={extra.rewards} color="palette.text.shade80" />
            <Box horizontal>
              <CounterValue
                color="palette.text.shade60"
                fontSize={3}
                currency={currency}
                value={extra.rewards}
                subMagnitude={1}
                prefix={
                  <Box mr={1} color="palette.text.shade60" style={{ lineHeight: 1.2 }}>
                    {"≈"}
                  </Box>
                }
              />
            </Box>
          </OpDetailsData>
        </>
      )}
      {extra.assetId && (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.assetId"} />
            </OpDetailsTitle>
            {extra.assetId}
          </OpDetailsData>
        </>
      )}
      {extra.memo && (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.memo"} />
            </OpDetailsTitle>
            {extra.memo}
          </OpDetailsData>
        </>
      )}
    </>
  );
};

type Props = {
  amount: BigNumber,
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

const AmountCell = ({ amount, operation, currency, unit }: Props) => {
  const reward =
    operation.extra && operation.extra.rewards ? operation.extra.rewards : BigNumber(0);

  const discreet = useDiscreetMode();
  const locale = useSelector(localeSelector);

  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet,
    locale,
  };

  return (
    <>
      <ToolTip
        content={
          reward.gt(0) ? (
            <Trans
              i18nKey="algorand.operationEarnedRewards"
              values={{ amount: formatCurrencyUnit(unit, reward, formatConfig) }}
            >
              <b></b>
            </Trans>
          ) : null
        }
      >
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          alwaysShowSign
          color={amount.isNegative() ? "palette.text.shade80" : undefined}
        />
      </ToolTip>
      <CounterValue
        color="palette.text.shade60"
        fontSize={3}
        alwaysShowSign
        date={operation.date}
        currency={currency}
        value={amount}
      />
    </>
  );
};

type ConfirmationCellProps = {
  operation: Operation,
  isConfirmed: boolean,
  marketColor: string,
  hasFailed: boolean,
  t: TFunction,
  withTooltip: boolean,
  style?: *,
};

const ConfirmationCell = ({
  operation,
  isConfirmed,
  marketColor,
  hasFailed,
  t,
  withTooltip = true,
  style,
}: ConfirmationCellProps) => {
  const reward =
    operation.extra && operation.extra.rewards ? operation.extra.rewards : BigNumber(0);

  return (
    <Cell alignItems="center" justifyContent="flex-start" style={style}>
      {reward.gt(0) ? (
        <>
          <CellIcon index={1}>
            <ConfirmationCheck
              type={operation.type}
              isConfirmed={isConfirmed}
              marketColor={marketColor}
              hasFailed={operation.hasFailed}
              t={t}
              withTooltip={withTooltip}
            />
          </CellIcon>
          <Spacer />
          <CellIcon index={0}>
            <ToolTip content={withTooltip ? t("algorand.operationHasRewards") : null}>
              <ConfirmationCellContainer
                type={"REWARD"}
                isConfirmed={isConfirmed}
                marketColor={marketColor}
                hasFailed={hasFailed}
                t={t}
              >
                <ClaimRewards size={12} />
              </ConfirmationCellContainer>
            </ToolTip>
          </CellIcon>
        </>
      ) : (
        <ConfirmationCheck
          type={operation.type}
          isConfirmed={isConfirmed}
          marketColor={marketColor}
          hasFailed={operation.hasFailed}
          t={t}
          withTooltip={withTooltip}
        />
      )}
    </Cell>
  );
};

const AmountTooltip = ({
  operation,
  amount,
  unit,
}: {
  operation: Operation,
  amount: BigNumber,
  unit: Unit,
}) => {
  const discreet = useDiscreetMode();
  const locale = useSelector(localeSelector);

  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    discreet,
    locale,
  };

  const reward = operation.extra.rewards ? operation.extra.rewards : BigNumber(0);
  const initialAmount = amount.minus(reward);
  return reward.gt(0) ? (
    <Trans
      i18nKey="algorand.operationDetailsAmountBreakDown"
      values={{
        initialAmount: formatCurrencyUnit(unit, initialAmount, { ...formatConfig, showCode: true }),
        reward: formatCurrencyUnit(unit, reward, formatConfig),
      }}
    >
      <b></b>
    </Trans>
  ) : null;
};

const amountCell = {
  OUT: AmountCell,
  IN: AmountCell,
};

const confirmationCell = {
  OUT: ConfirmationCell,
  IN: ConfirmationCell,
};

const amountTooltip = {
  OUT: AmountTooltip,
  IN: AmountTooltip,
};

export default {
  OperationDetailsExtra,
  amountCell,
  confirmationCell,
  amountTooltip,
};
