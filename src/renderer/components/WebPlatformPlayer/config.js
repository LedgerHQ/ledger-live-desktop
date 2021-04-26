export const PlatformsConfig = {
  // debug: {
  //   url: "https://iframe-dapp-browser-test.vercel.app/app/debug",
  //   host: "https://iframe-dapp-browser-test.vercel.app",
  //   name: "Debugger",
  // },
  debug: {
    url: "http://localhost:3000/app/debug",
    name: "Debugger",
    icon: null,
  },
  paraswap: {
    url:
      "https://iframe-dapp-browser-test.vercel.app/app/dapp-browser?url=https://paraswap-ui-ledger.herokuapp.com/?embed=true",
    name: "Paraswap",
    icon: require("../../images/platform/paraswap.png").default,
  },
};
