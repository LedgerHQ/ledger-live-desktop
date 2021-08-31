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
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import { rateSelector } from "~/renderer/actions/swap";
import FormattedVal from "~/renderer/components/FormattedVal";
import Text from "~/renderer/components/Text";

const SectionFees = ({ swapTransaction }: { swapTransaction: SwapTransactionType }) => {
  const { t } = useTranslation();
  const { setDrawer } = React.useContext(context);
  const { account, transaction } = swapTransaction;
  const exchangeRate = useSelector(rateSelector);
  const fromAccount = swapTransaction.swap.from.account;
  const fromAccountUnit = fromAccount && getAccountUnit(fromAccount);
  const estimatedFees = swapTransaction.status?.estimatedFees;
  const showSummaryValue = fromAccountUnit && estimatedFees && estimatedFees.gt(0);
  const canEdit =
    showSummaryValue && transaction?.networkInfo && sendAmountByFamily[account?.currency?.family];

  // Deselect slow strategy if the exchange rate is changed to fixed.
  useEffect(
    () => {
      if (
        exchangeRate?.tradeMethod === "fixed" &&
        swapTransaction.transaction?.feesStrategy === "slow"
      ) {
        swapTransaction.updateTransaction(t => ({
          ...t,
          feesStrategy: "medium",
        }));
      }
    },
    // eslint-disable-next-line
    [swapTransaction.transaction?.feesStrategy, exchangeRate?.tradeMethod],
  );

  const handleChange = useMemo(
    () =>
      canEdit &&
      (() =>
        setDrawer(FeesDrawer, {
          swapTransaction,
          disableSlowStrategy: exchangeRate?.tradeMethod === "fixed",
        })),
    [canEdit, setDrawer, swapTransaction, exchangeRate?.tradeMethod],
  );

  const summaryValue = canEdit ? (
    <FormattedVal
      color="palette.text.shade100"
      val={estimatedFees}
      unit={fromAccountUnit}
      fontSize={3}
      ff="Inter|SemiBold"
      showCode
      alwaysShowValue
    />
  ) : (
    <Text color="palette.text.shade100" fontSize={4}>
      {"-"}
    </Text>
  );

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.fees")}
        details={t("swap2.form.details.tooltip.fees")}
      />
      <SummaryValue handleChange={handleChange}>{summaryValue}</SummaryValue>
    </SummarySection>
  );
};

export default SectionFees;
