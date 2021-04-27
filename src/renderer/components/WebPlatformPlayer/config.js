// @flow
import qs from "qs";

const DAPP_BROWSER = "https://iframe-dapp-browser-test.vercel.app/app/dapp-browser";

export const PlatformsConfig = {
  debug: {
    isDapp: false,
    url: "https://iframe-dapp-browser-test.vercel.app/app/debug",
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
    // $FlowFixMe
    icon: require("../../images/platform/paraswap.png").default,
  },
};

export const getPlatformUrl = (platform: string, t?: number) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  const params = {
    t,
    ...config.params,
  };

  return `${config.url}?${qs.stringify(params)}`;
};

export const getPlatformOrigin = (platform: string) => {
  const config = PlatformsConfig[platform];
  if (!config) {
    return null;
  }

  return new URL(config.url).origin;
};

export const getPlatformName = (platform: string) => {
  return PlatformsConfig[platform]?.name || null;
};
