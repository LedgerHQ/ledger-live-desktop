// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Rate from "./Rate";
import type { SwapTransactionType } from "../../utils/shared/useSwapTransaction";
import { rateSelector, updateRateAction } from "~/renderer/actions/swap";
import { DrawerTitle } from "../DrawerTitle";
type Props = {
  swapTransaction: SwapTransactionType,
};
export default function ProviderRateDrawer({ swapTransaction }: Props) {
  const dispatch = useDispatch();
  const rates = swapTransaction.swap.rates.value;
  const selectedRate = useSelector(rateSelector);

  const setRate = useCallback(
    rate => {
      dispatch(updateRateAction(rate));
    },
    [dispatch],
  );

  return (
    <Box height="100%">
      <DrawerTitle i18nKey="swap2.form.ratesDrawer.title" />
      <Box mt={3}>
        <Box
          horizontal
          justifyContent="space-between"
          fontWeight="500"
          fontSize={3}
          color="palette.text.shade40"
          px={6}
        >
          <Text>
            <Trans i18nKey="swap2.form.ratesDrawer.quote" />
          </Text>
          <Text>
            <Trans i18nKey="swap2.form.ratesDrawer.receive" />
          </Text>
        </Box>
      </Box>
      <Box mt={3}>
        {rates.map((rate, index) => (
          <Rate
            key={rate.rateId || index}
            value={rate}
            selected={rate === selectedRate}
            onSelect={setRate}
            swapTransaction={swapTransaction}
          />
        ))}
      </Box>
    </Box>
  );
}
