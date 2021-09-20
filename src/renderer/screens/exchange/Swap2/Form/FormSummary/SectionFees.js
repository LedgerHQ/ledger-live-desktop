// @flow
import React, { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { context } from "~/renderer/drawers/Provider";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import SummarySection from "./SummarySection";
import FeesDrawer from "../FeesDrawer";
import sendAmountByFamily from "~/renderer/generated/SendAmountFields";
import type {
  SwapTransactionType,
  SwapSelectorStateType,
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import { rateSelector } from "~/renderer/actions/swap";
import FormattedVal from "~/renderer/components/FormattedVal";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import TachometerHigh from "~/renderer/icons/TachometerHigh";
import TachometerLow from "~/renderer/icons/TachometerLow";
import TachometerMedium from "~/renderer/icons/TachometerMedium";
import styled from "styled-components";

type Strategies = "slow" | "medium" | "fast" | "advanced";
const FEES_STRATEGY_ICONS: {
  [Strategies]: ({ color?: string, size?: number }) => React$Element<"svg">,
} = {
  slow: TachometerLow,
  medium: TachometerMedium,
  fast: TachometerHigh,
  advanced: TachometerHigh,
};

const IconSection = styled(Box)`
  flex-direction: row;
  column-gap: 0.25rem;
  color: ${props => props.theme.colors.palette.text.shade40};
`;

const Separator = styled.div`
  width: 3px;
  height: 3px;
  background-color: ${props => props.theme.colors.palette.text.shade40};
  border-radius: 9999px;
  align-self: center;
  margin-left: 2px;
`;

type Props = {
  transaction: $PropertyType<SwapTransactionType, "transaction">,
  account: $PropertyType<SwapSelectorStateType, "account">,
  parentAccount: $PropertyType<SwapSelectorStateType, "parentAccount">,
  currency: $PropertyType<SwapSelectorStateType, "currency">,
  status: $PropertyType<SwapTransactionType, "status">,
  updateTransaction: $PropertyType<SwapTransactionType, "updateTransaction">,
  setTransaction: $PropertyType<SwapTransactionType, "setTransaction">,
  provider: ?string,
};
const SectionFees = ({
  transaction,
  account,
  parentAccount,
  currency,
  status,
  updateTransaction,
  setTransaction,
  provider,
}: Props) => {
  const { t } = useTranslation();
  const { setDrawer } = React.useContext(context);
  const exchangeRate = useSelector(rateSelector);
  const fromAccountUnit = account && getAccountUnit(account);
  const estimatedFees = status?.estimatedFees;
  const showSummaryValue = fromAccountUnit && estimatedFees && estimatedFees.gt(0);
  const canEdit =
    showSummaryValue &&
    transaction?.networkInfo &&
    account &&
    sendAmountByFamily[account.currency?.family];

  const StrategyIcon = useMemo(() => FEES_STRATEGY_ICONS[transaction?.feesStrategy], [
    transaction?.feesStrategy,
  ]);

  // Deselect slow strategy if the exchange rate is changed to fixed.
  useEffect(
    () => {
      if (exchangeRate?.tradeMethod === "fixed" && transaction?.feesStrategy === "slow") {
        updateTransaction(t => ({
          ...t,
          feesStrategy: "medium",
        }));
      }
    },
    // eslint-disable-next-line
    [transaction?.feesStrategy, exchangeRate?.tradeMethod, updateTransaction],
  );

  const handleChange = useMemo(
    () =>
      canEdit &&
      (() =>
        setDrawer(FeesDrawer, {
          setTransaction,
          updateTransaction,
          account,
          parentAccount,
          currency,
          status,
          disableSlowStrategy: exchangeRate?.tradeMethod === "fixed",
          provider,
        })),
    [
      canEdit,
      setDrawer,
      setTransaction,
      updateTransaction,
      account,
      parentAccount,
      currency,
      status,
      provider,
      exchangeRate?.tradeMethod,
    ],
  );

  const summaryValue = canEdit ? (
    <>
      <IconSection>
        {StrategyIcon ? <StrategyIcon /> : null}
        <Text fontSize={4} fontWeight="600">
          {t(`fees.${transaction?.feesStrategy}`)}
        </Text>
        <Separator />
      </IconSection>
      <FormattedVal
        color="palette.text.shade100"
        val={estimatedFees}
        unit={fromAccountUnit}
        fontSize={3}
        ff="Inter|SemiBold"
        showCode
        alwaysShowValue
      />
    </>
  ) : (
    <Text color="palette.text.shade100" fontSize={4}>
      {"-"}
    </Text>
  );

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.fees")} />
      <SummaryValue handleChange={handleChange}>{summaryValue}</SummaryValue>
    </SummarySection>
  );
};

export default React.memo<Props>(SectionFees);
