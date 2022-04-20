// @flow
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
// $FlowFixMe
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { MarketDataProvider } from "@ledgerhq/live-common/lib/market/MarketDataProvider";
import apiMock from "@ledgerhq/live-common/lib/market/api/api.mock";

type Props = {
  children: React.ReactNode;
};

export default function MarketDataProviderWrapper({ children }: Props): ReactElement {
  const counterValueCurrency: any = useSelector(counterValueCurrencySelector);

  return (
    <MarketDataProvider
      {...(process.env.PLAYWRIGHT_RUN ? { fetchApi: apiMock } : {})}
      countervalue={counterValueCurrency}
    >
      {children}
    </MarketDataProvider>
  );
}
