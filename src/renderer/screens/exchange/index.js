// @flow

import React, { useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { Account } from "@ledgerhq/live-common/lib/types/account";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import TabBar from "~/renderer/components/TabBar";
import Card from "~/renderer/components/Box/Card";
import Buy from "./Buy";
import Sell from "./Sell";
import { useExchangeProvider } from "./hooks";

const Container: ThemedComponent<{ selectable: boolean, pb: number }> = styled(Box)`
  flex: 1;
  display: flex;
`;

const tabs = [
  {
    header: "exchange.buy.header",
    title: "exchange.buy.tab",
    component: Buy,
  },
  {
    header: "exchange.sell.header",
    title: "exchange.sell.tab",
    component: Sell,
  },
];

export type DProps = {
  defaultCurrency?: ?(CryptoCurrency | TokenCurrency),
  defaultAccount?: ?Account,
};

const Exchange = () => {
  const location = useLocation();
  const [provider] = useExchangeProvider();
  const { state } = location;
  const [activeTabIndex, setActiveTabIndex] = useState(state?.tab || 0);
  const { t } = useTranslation();
  const Component = tabs[activeTabIndex].component;

  return (
    <Container pb={6} selectable>
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="exchange-title">
        {t(tabs[activeTabIndex].header, { provider: provider.id })}
      </Box>
      <TabBar
        defaultIndex={activeTabIndex}
        tabs={tabs.map(tab => t(tab.title))}
        onIndexChange={setActiveTabIndex}
      />
      <Card grow style={{ overflow: "hidden" }}>
        <Component
          defaultCurrency={state?.defaultCurrency}
          defaultAccount={state?.defaultAccount}
          provider={provider}
        />
      </Card>
    </Container>
  );
};

export default Exchange;
