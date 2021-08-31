// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Rate from "./Rate";
import type { SwapTransactionType } from "../../utils/shared/useSwapTransaction";
import { rateSelector, updateRateAction } from "~/renderer/actions/swap";

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  margin-top: 24px;
  margin-bottom: 24px;
`;
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

  const titleSection = (
    <>
      <Box horizontal justifyContent="center">
        <Text fontSize={6} fontWeight="600" ff="Inter">
          <Trans i18nKey="swap2.form.ratesDrawer.title" />
        </Text>
      </Box>
      <Separator />
    </>
  );

  return (
    <Box height="100%">
      {titleSection}
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
