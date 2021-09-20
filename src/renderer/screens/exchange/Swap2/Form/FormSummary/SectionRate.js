// @flow
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import SummaryLabel from "./SummaryLabel";
import SummaryValue from "./SummaryValue";
import { useTranslation } from "react-i18next";
import IconLock from "~/renderer/icons/Lock";
import IconLockOpen from "~/renderer/icons/LockOpen";
import SummarySection from "./SummarySection";
import { context } from "~/renderer/drawers/Provider";
import RatesDrawer from "../RatesDrawer";
import type {
  SwapSelectorStateType,
  RatesReducerState,
  SwapDataType,
} from "../../utils/shared/useSwapTransaction";
import Price from "~/renderer/components/Price";
import { rateSelector, rateExpirationSelector } from "~/renderer/actions/swap";
import Text from "~/renderer/components/Text";
import Spinner from "~/renderer/components/Spinner";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import Box from "~/renderer/components/Box";
import AnimatedCountdown from "~/renderer/components/AnimatedCountdown";
import { ratesExpirationThreshold } from "~/renderer/reducers/swap";

type Props = {
  ratesState: RatesReducerState,
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  refetchRates: $PropertyType<SwapDataType, "refetchRates">,
  provider: ?string,
};
const SectionRate = ({ fromCurrency, toCurrency, ratesState, refetchRates, provider }: Props) => {
  const { t } = useTranslation();
  const { setDrawer } = useContext(context);
  const exchangeRate = useSelector(rateSelector);
  const ratesExpiration = useSelector(rateExpirationSelector);
  const rates = ratesState.value;
  const handleChange = useMemo(
    () =>
      rates &&
      rates.length > 1 &&
      (() =>
        setDrawer(RatesDrawer, {
          fromCurrency,
          toCurrency,
          rates,
          provider,
        })),
    [setDrawer, rates, fromCurrency, toCurrency, provider],
  );

  const summaryValue =
    ratesState.status === "loading" ? (
      <Spinner size={17} color="palette.text.shade40" my="1px" />
    ) : exchangeRate && fromCurrency && toCurrency ? (
      <SummaryValue handleChange={handleChange}>
        {ratesExpiration && exchangeRate.tradeMethod === "fixed" && (
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
      <Text color="palette.text.shade100" fontSize={4}>
        {"-"}
      </Text>
    );

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.rate")} />
      {summaryValue}
    </SummarySection>
  );
};

export default SectionRate;
