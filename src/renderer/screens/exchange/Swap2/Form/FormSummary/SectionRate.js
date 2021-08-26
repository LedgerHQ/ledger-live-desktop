// @flow
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import { useTranslation } from "react-i18next";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import SummarySection from "./SummarySection";
import { context } from "~/renderer/drawers/Provider";
import RatesDrawer from "../RatesDrawer";
import type { SwapTransactionType } from "../../utils/shared/useSwapTransaction";
import Price from "~/renderer/components/Price";
import { rateSelector } from "~/renderer/actions/swap";
import Text from "~/renderer/components/Text";
import Spinner from "~/renderer/components/Spinner";

type Props = {
  swapTransaction: SwapTransactionType,
};
const SectionRate = ({ swapTransaction }: Props) => {
  const { t } = useTranslation();
  const { setDrawer } = useContext(context);
  const exchangeRate = useSelector(rateSelector);
  const fromCurrency = swapTransaction.swap.from.currency;
  const toCurrency = swapTransaction.swap.to.currency;

  const summaryValue =
    swapTransaction.swap.rates.status === "loading" ? (
      <Spinner size={16} color="palette.text.shade40" />
    ) : exchangeRate && fromCurrency && toCurrency ? (
      <SummaryValue
        handleChange={() =>
          setDrawer(RatesDrawer, {
            swapTransaction,
          })
        }
      >
        {exchangeRate.tradeMethod === "fixed" ? <IconLock size={16} /> : <IconLockOpen size={16} />}
        <Price
          withEquality
          withIcon={false}
          from={fromCurrency}
          to={toCurrency}
          rate={exchangeRate.magnitudeAwareRate}
          fontSize={4}
          fontWeight={600}
        />
      </SummaryValue>
    ) : (
      <Text color="palette.text.shade100">{"-"}</Text>
    );

  return (
    <SummarySection>
      <SummaryLabel
        label={t("swap2.form.details.label.rate")}
        details={t("swap2.form.details.tooltip.rate")}
      />
      {summaryValue}
    </SummarySection>
  );
};

export default SectionRate;
