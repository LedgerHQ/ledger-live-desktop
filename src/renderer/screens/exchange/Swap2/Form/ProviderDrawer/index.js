// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import { getProviders } from "@ledgerhq/live-common/lib/exchange/swap";
import type { AvailableProvider } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { SwapNoAvailableProviders } from "@ledgerhq/live-common/lib/errors";
import Changelly from "~/renderer/icons/Changelly";
import Provider from "./Provider";

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
  const [providers, setProviders] = React.useState([]);
  const [selectedProvider, setSelectedProvider] = React.useState(null);

  React.useEffect(() => {
    getProviders().then(providers => {
      setProviders(_ => (providers instanceof SwapNoAvailableProviders ? [] : providers));
    });
  }, []);

  // Fake data (arbitrary format)
  const dummyProviders: Array<FakeProvider> = React.useMemo(() => providers.map(makeFakeProvider), [
    providers,
  ]);

  return (
    <div>
      <Box horizontal justifyContent="center">
        <Text fontSize={6} fontWeight="600">
          <Trans i18nKey="swap2.form.providerDrawer.title" />
        </Text>
      </Box>
      <Separator />
      <Box marginTop={6}>
        <Box
          horizontal
          justifyContent="space-between"
          fontWeight="500"
          fontSize={3}
          color="palette.text.shade40"
          paddingX={6}
        >
          <Text>
            <Trans i18nKey="swap2.form.providerDrawer.quote" />
          </Text>
          <Text>
            <Trans i18nKey="swap2.form.providerDrawer.receive" />
          </Text>
        </Box>
      </Box>
      <Box marginTop={3}>
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
    </div>
  );
}
