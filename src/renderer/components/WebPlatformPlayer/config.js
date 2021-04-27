// @flow
import qs from "qs";

const DAPP_BROWSER = "https://iframe-dapp-browser-test.vercel.app/app/dapp-browser";

export const PlatformsConfig = {
  // debug: {
  //   url: "https://iframe-dapp-browser-test.vercel.app/app/debug",
  //   host: "https://iframe-dapp-browser-test.vercel.app",
  //   name: "Debugger",
  // },
  debug: {
    isDapp: false,
    url: "http://localhost:3000/app/debug",
    name: "Debugger",
    icon: null,
  },
  paraswap: {
    isDapp: true,
    url: DAPP_BROWSER,
    name: "ParaSwap",
    params: {
      url: "https://paraswap-ui-ledger.herokuapp.com/?embed=true",
      appName: "paraswap",
    },
    icon: require("../../images/platform/paraswap.png").default,
  },
};

export const getPlatformUrl = (platform: string, t?: Number) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  const url = config.isDapp ? DAPP_BROWSER : config.url;

  const params = {
    t,
    ...config.params,
  };

  return `${url}?${qs.stringify(params)}`;
};

export const getPlatformOrigin = (platform: string) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  return new URL(config.url).origin;
};
