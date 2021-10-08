// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Rate from "./Rate";
import type {
  SwapSelectorStateType,
  RatesReducerState,
} from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import { rateSelector, updateRateAction } from "~/renderer/actions/swap";
import { DrawerTitle } from "../DrawerTitle";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SWAP_VERSION } from "../../utils/index";
import { context } from "~/renderer/drawers/Provider";

type Props = {
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  rates: $PropertyType<RatesReducerState, "value">,
  provider: ?string,
};
export default function ProviderRateDrawer({ fromCurrency, toCurrency, rates, provider }: Props) {
  const dispatch = useDispatch();
  const selectedRate = useSelector(rateSelector);
  const { setDrawer } = React.useContext(context);

  const setRate = useCallback(
    rate => {
      dispatch(updateRateAction(rate));
      setDrawer(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch],
  );

  return (
    <Box height="100%">
      <TrackPage
        category="Swap"
        name="Form - Edit Rates"
        provider={provider}
        swapVersion={SWAP_VERSION}
      />
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
        {rates?.map((rate, index) => (
          <Rate
            key={rate.rateId || index}
            value={rate}
            selected={rate === selectedRate}
            onSelect={setRate}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
          />
        ))}
      </Box>
    </Box>
  );
}
