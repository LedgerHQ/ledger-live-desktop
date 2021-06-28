// @flow

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSwapSelectableCurrencies } from "@ledgerhq/live-common/lib/exchange/swap/logic";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import { swapKYCSelector } from "~/renderer/reducers/settings";
import { Trans, useTranslation } from "react-i18next";

import TabBar from "~/renderer/components/TabBar";
import Box from "~/renderer/components/Box";
import { setSwapSelectableCurrencies } from "~/renderer/actions/settings";
import Loading from "~/renderer/screens/exchange/swap/Loading";
import KYC from "~/renderer/screens/exchange/swap/KYC";
import Form from "~/renderer/screens/exchange/swap/Form";
import History from "~/renderer/screens/exchange/swap/History";
import NotAvailable from "~/renderer/screens/exchange/swap/NotAvailable";
import TrackPage from "~/renderer/analytics/TrackPage";

const SwapEntrypoint = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [providers, setProviders] = useState();
  const [provider, setProvider] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const swapKYC = useSelector(swapKYCSelector);
  const showWyreKYC = provider === "wyre" && swapKYC?.wyre?.status !== "approved";

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
      } else {
        setProviders([]);
      }
    });
  }, [dispatch]);

  return (
    <Box flex={1} pb={6}>
      <TrackPage category="Swap" />
      <Box horizontal>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <TabBar
        tabs={[t("swap.tabs.exchange"), t("swap.tabs.history")]}
        onIndexChange={setTabIndex}
        index={tabIndex}
      />
      {tabIndex === 0 ? (
        !providers ? (
          <Loading />
        ) : showWyreKYC ? (
          <KYC />
        ) : provider ? (
          <Form providers={providers} provider={provider} setTabIndex={setTabIndex} />
        ) : (
          <NotAvailable />
        )
      ) : (
        <History />
      )}
    </Box>
  );
};

export default SwapEntrypoint;
