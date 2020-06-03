// @flow

import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";

export const supportedCurrenciesIds = ["bitcoin", "ethereum", "bitcoin_cash", "dash"];

export const isCurrencySupported = (currency: TokenCurrency | CryptoCurrency) =>
  supportedCurrenciesIds.includes(currency.id);

type Config = {
  host: string,
  url: string,
  partnerId: number,
};

const config = {
  sandbox: {
    host: "https://trade-ui.sandbox.coinify.com",
    url: "https://trade-ui.sandbox.coinify.com/widget",
    partnerId: 104,
  },
  production: {
    host: "https://trade-ui.coinify.com",
    url: "https://trade-ui.coinify.com/widget",
    partnerId: 119,
  },
};

export const getConfig = (): Config =>
  process.env.COINIFY_SANDBOX ? config.sandbox : config.production;
