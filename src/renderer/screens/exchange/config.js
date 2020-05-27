// @flow

export const supportedCurrenciesIds = ["bitcoin", "ethereum", "bitcoin_cash", "dash"];

const config = {
  developpement: {
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

export const getConfig = (env: string) => config[env];
