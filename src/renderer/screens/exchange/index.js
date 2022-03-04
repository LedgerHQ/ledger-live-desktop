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
import OnRamp from "./Buy";
import OffRamp from "./Sell";
import { useExchangeProvider, useRampCatalogCurrencies } from "./hooks";
import { useRampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider";
import type { RampCatalog } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";

const Container: ThemedComponent<{ selectable: boolean, pb: number }> = styled(Box)`
  flex: 1;
  display: flex;
`;

const tabs = [
  {
    header: "exchange.buy.header",
    title: "exchange.buy.tab",
    component: OnRamp,
  },
  {
    header: "exchange.sell.header",
    title: "exchange.sell.tab",
    component: OffRamp,
  },
];

export type DProps = {
  defaultCurrencyId?: ?string,
  defaultAccountId?: ?string,
  defaultTicker?: ?string,
  rampCatalog: RampCatalog,
};

type QueryParams = {
  mode?: "onRamp" | "offRamp",
  currencyId?: string,
  accountId?: string,
  defaultTicker?: string,
};

const Exchange = () => {
  const rampCatalog = useRampCatalog();

  const location = useLocation();
  const [provider] = useExchangeProvider();
  const state: QueryParams = location.state;

  console.log("DEFAULT MULTIBUY PARAMS: ", state);

  const defaultMode = state?.mode || "onRamp";
  const [activeTabIndex, setActiveTabIndex] = useState(defaultMode === "onRamp" ? 0 : 1);

  const { t } = useTranslation();
  const Component = tabs[activeTabIndex].component;

  return (
    <Container pb={6} selectable>
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100" id="exchange-title">
        {t(tabs[activeTabIndex].header, { provider: provider.id })}
      </Box>
      <TabBar
        index={activeTabIndex}
        tabs={tabs.map(tab => t(tab.title))}
        onIndexChange={setActiveTabIndex}
      />
      <Card grow style={{ overflow: "hidden" }}>
        <Component
          defaultCurrencyId={state?.currencyId}
          defaultAccountId={state?.accountId}
          defaultTicker={state?.defaultTicker}
          rampCatalog={rampCatalog}
        />
      </Card>
    </Container>
  );
};

export default Exchange;
