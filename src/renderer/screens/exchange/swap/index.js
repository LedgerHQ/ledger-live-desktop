// @flow

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSwapSelectableCurrencies } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";

import Swap from "~/renderer/screens/exchange/swap/Swap";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { setSwapSelectableCurrencies } from "~/renderer/actions/settings";
import Loading from "~/renderer/screens/exchange/swap/Loading";
import TrackPage from "~/renderer/analytics/TrackPage";

const SwapEntrypoint = () => {
  const dispatch = useDispatch();
  const [providers, setProviders] = useState();
  const [provider, setProvider] = useState();

  useEffect(() => {
    getProviders().then((providers: any) => {
      let resultProvider;
      const disabledProviders = process.env.SWAP_DISABLED_PROVIDERS || "";
      const providersByName = providers.reduce((acc, providerData) => {
        if (!disabledProviders.includes(providerData.provider)) {
          acc[providerData.provider] = providerData;
        }
        return acc;
      }, {});
      // Prio to changelly if both are available
      if ("wyre" in providersByName && "changelly" in providersByName) {
        resultProvider = providersByName.changelly;
      } else {
        resultProvider = providers.find(p => !disabledProviders.includes(p.provider));
      }
      console.log("wure", providersByName, providers, resultProvider);

      // Only set as available currencies from this provider, on swp-agg this changes
      if (resultProvider) {
        dispatch(setSwapSelectableCurrencies(getSwapSelectableCurrencies([resultProvider])));
        setProviders([resultProvider]);
        setProvider(resultProvider.provider);
      }
    });
  }, [dispatch]);

  return (
    <Box flex={1} pb={6}>
      <TrackPage category="Swap" />
      {!providers ? (
        <Loading />
      ) : provider ? (
        <Swap providers={providers} provider={provider} />
      ) : (
        <Text>{JSON.stringify(provider)}</Text>
      )}
    </Box>
  );
};

export default SwapEntrypoint;
