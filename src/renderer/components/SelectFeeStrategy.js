// @flow
import React from "react";
import styled from "styled-components";
import { useTranslation, Trans } from "react-i18next";
import type { BigNumber } from "bignumber.js";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TachometerHigh from "~/renderer/icons/TachometerHigh";
import TachometerLow from "~/renderer/icons/TachometerLow";
import TachometerMedium from "~/renderer/icons/TachometerMedium";

import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";

import {
  getAccountCurrency,
  getAccountUnit,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import type { Account, FeeStrategy } from "@ledgerhq/live-common/lib/types";

type OnClickType = {
  amount: BigNumber,
  feesStrategy: string,
};

type Props = {
  onClick: OnClickType => void,
  transaction: *,
  account: Account,
  parentAccount: ?Account,
  strategies: FeeStrategy[],
  mapStrategies?: FeeStrategy => FeeStrategy & { [string]: * },
  suffixPerByte?: boolean,
};

const FeesWrapper = styled(Box)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: ${p =>
    `1px solid ${
      p.selected ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider
    }`};
  ${p => (p.selected ? "box-shadow: 0px 0px 0px 4px rgba(138, 128, 219, 0.3);" : "")}
  padding: 20px 16px;
  width: 100%;
  font-family: "Inter";
  border-radius: 4px;
  ${p => (p.disabled ? `background: ${p.theme.colors.palette.background.default};` : "")};

  &:hover {
    cursor: ${p => (p.disabled ? "unset" : "pointer")};
  }
`;

const FeesHeader = styled(Box)`
  color: ${p =>
    p.selected
      ? p.theme.colors.palette.primary.main
      : p.disabled
      ? p.theme.colors.palette.text.shade20
      : p.theme.colors.palette.text.shade50};
`;

const FeesValue = styled(Box)`
  flex-direction: row;
  align-items: center;
`;

const SelectFeeStrategy = ({
  transaction,
  account,
  parentAccount,
  onClick,
  strategies,
  mapStrategies,
  suffixPerByte,
}: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const accountUnit = getAccountUnit(mainAccount);
  const feesCurrency = getAccountCurrency(mainAccount);
  const { t } = useTranslation();
  strategies = mapStrategies ? strategies.map(mapStrategies) : strategies;

  return (
    <Box alignItems="center" flow={2}>
      {strategies.map(s => {
        const selected = transaction.feesStrategy === s.label;
        const amount = s.displayedAmount || s.amount;
        const { label, disabled } = s;
        return (
          <FeesWrapper
            key={s.label}
            selected={selected}
            disabled={disabled}
            onClick={() => {
              !disabled && onClick({ amount: s.amount, feesStrategy: label });
            }}
          >
            <FeesHeader horizontal alignItems="center" selected={selected} disabled={disabled}>
              {label === "medium" ? (
                <TachometerMedium size={14} />
              ) : label === "slow" ? (
                <TachometerLow size={14} />
              ) : (
                <TachometerHigh size={14} />
              )}
              <Text fontSize={0} ff="Inter|ExtraBold" uppercase ml={1}>
                <Trans i18nKey={`fees.${label}`} />
              </Text>
            </FeesHeader>
            <FeesValue>
              {s.displayedAmount ? (
                <CounterValue
                  currency={feesCurrency}
                  value={amount}
                  color={disabled ? "palette.text.shade20" : "palette.text.shade50"}
                  fontSize={3}
                  mr={2}
                  showCode
                  alwaysShowValue
                />
              ) : null}
              <FormattedVal
                noShrink
                inline
                color={
                  selected
                    ? "palette.primary.main"
                    : disabled
                    ? "palette.text.shade40"
                    : "palette.text.shade100"
                }
                fontSize={3}
                fontWeight="600"
                val={amount}
                unit={s.unit ?? accountUnit}
                showCode={!suffixPerByte}
                suffix={
                  suffixPerByte
                    ? ` ${t("send.steps.details.unitPerByte", {
                        unit: s.unit ? s.unit.code : accountUnit.code,
                      })}`
                    : ""
                }
                alwaysShowValue
              />
            </FeesValue>
          </FeesWrapper>
        );
      })}
    </Box>
  );
};

export default SelectFeeStrategy;
