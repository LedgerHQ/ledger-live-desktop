// @flow
import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import Changelly from "~/renderer/icons/Changelly";
import Provider from "./Provider";
import BigSpinner from "~/renderer/components/BigSpinner";

const Separator = styled.div`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  margin-top: 24px;
  margin-bottom: 24px;
`;

function ChangellyIcon({ ...iconProps }) {
  return (
    <Box color="rgba(84, 202, 148, 1);">
      <Changelly {...iconProps} />
    </Box>
  );
}

function makeFakeProvider(p: AvailableProvider, index: number) {
  return {
    ...p,
    onChain: !(index % 2),
    amount: Math.random() * 1000,
    value: Math.random() * 100000,
    rate: Math.random() * 20,
    fiatUnit: "$",
    fromUnit: "ETH",
    toUnit: "BTC",
    tradeMethod: index % 2 ? "fixed" : "float",
    iconComponent: ChangellyIcon,
  };
}
export type FakeProvider = $Call<typeof makeFakeProvider, AvailableProvider, number>;

// TODO: pass as props to control state from above
/*
type Props = {
  selectedProvider: FakeProvider,
  setSelectedProvider: FakeProvider => void
}
*/

export default function ProviderDrawer() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    getProviders()
      .then(providers => {
        setProviders(_ => (providers instanceof SwapNoAvailableProviders ? [] : providers));
      })
      // TODO: handle error(s) properly
      .catch(_error => setProviders([]))
      .then(() => setLoading(false));
  }, []);

  // Fake data (arbitrary format)
  const dummyProviders: Array<FakeProvider> = useMemo(() => providers.map(makeFakeProvider), [
    providers,
  ]);

  const titleSection = (
    <>
      <Box horizontal justifyContent="center">
        <Text fontSize={6} fontWeight="600">
          <Trans i18nKey="swap2.form.providerDrawer.title" />
        </Text>
      </Box>
      <Separator />
    </>
  );

  if (loading) {
    return (
      <Box height="100%">
        {titleSection}
        <Box justifyContent="center" alignItems="center" flex={1}>
          <BigSpinner size={50} />
        </Box>
      </Box>
    );
  }

  return (
    <Box height="100%">
      {titleSection}
      <Box mt={6}>
        <Box
          horizontal
          justifyContent="space-between"
          fontWeight="500"
          fontSize={3}
          color="palette.text.shade40"
          px={6}
        >
          <Text>
            <Trans i18nKey="swap2.form.providerDrawer.quote" />
          </Text>
          <Text>
            <Trans i18nKey="swap2.form.providerDrawer.receive" />
          </Text>
        </Box>
      </Box>
      <Box mt={3}>
        {dummyProviders.map((provider, index) => (
          <Provider
            // TODO: replace index with a proper id when we have the real provider format
            key={index}
            provider={provider}
            selected={provider === selectedProvider}
            onSelect={setSelectedProvider}
          />
        ))}
      </Box>
    </Box>
  );
}
