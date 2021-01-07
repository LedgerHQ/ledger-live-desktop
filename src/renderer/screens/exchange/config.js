// @flow

import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types/currencies";

export const supportedBuyCurrenciesIds = [
  "bitcoin",
  "ethereum",
  "bitcoin_cash",
  "dash",
  "stellar",
  "ethereum/erc20/usd_tether__erc20_",
];

export const supportedSellCurrenciesIds = ["bitcoin"];

export const isCurrencySupported = (
  mode: "BUY" | "SELL",
  currency: TokenCurrency | CryptoCurrency,
) => {
  if (mode === "BUY") {
    return supportedBuyCurrenciesIds.includes(currency.id);
  }
  return supportedSellCurrenciesIds.includes(currency.id);
};

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
