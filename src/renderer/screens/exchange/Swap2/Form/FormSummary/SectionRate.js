// @flow
import type {
  RatesReducerState,
  SwapDataType,
  SwapSelectorStateType,
} from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { rateExpirationSelector, rateSelector } from "~/renderer/actions/swap";
import AnimatedCountdown from "~/renderer/components/AnimatedCountdown";
import Box from "~/renderer/components/Box";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import Price from "~/renderer/components/Price";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import { ratesExpirationThreshold } from "~/renderer/reducers/swap";
import SummaryLabel from "./SummaryLabel";
import SummarySection from "./SummarySection";
import SummaryValue, { NoValuePlaceholder } from "./SummaryValue";

type Props = {
  ratesState: RatesReducerState,
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  refetchRates: $PropertyType<SwapDataType, "refetchRates">,
  provider: ?string,
};
const SectionRate = ({ fromCurrency, toCurrency, ratesState, refetchRates, provider }: Props) => {
  const { t } = useTranslation();
  const exchangeRate = useSelector(rateSelector);
  const ratesExpiration = useSelector(rateExpirationSelector);

  const summaryValue =
    ratesState.status === "loading" ? (
      <NoValuePlaceholder />
    ) : exchangeRate && fromCurrency && toCurrency ? (
      <SummaryValue>
        {ratesExpiration && exchangeRate.tradeMethod === "fixed" && ratesExpiration > Date.now() && (
          <Box horizontal alignItems="center" mr={2}>
            <Box mr={1}>
              <AnimatedCountdown size={10} duration={ratesExpirationThreshold} />
            </Box>
            <Box>
              <CountdownTimer end={ratesExpiration} callback={refetchRates} />
            </Box>
          </Box>
        )}
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
      <NoValuePlaceholder />
    );

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.rate")} />
      {summaryValue}
    </SummarySection>
  );
};

export default SectionRate;
