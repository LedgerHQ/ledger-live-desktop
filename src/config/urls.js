// @flow

// FIXME live-common

export const supportLinkByTokenType = {
  erc20: "https://support.ledger.com/hc/en-us/articles/115005197845-Manage-ERC20-tokens",
  trc10: "https://support.ledger.com/hc/en-us/articles/360013062159",
  trc20: "https://support.ledger.com/hc/en-us/articles/360013062159",
  asa: "https://support.ledger.com/hc/en-us/articles/360015896040",
};

export const urls = {
  liveHome: "https://www.ledger.com/pages/ledger-live",

  social: {
    twitter: "https://twitter.com/Ledger",
    github: "https://github.com/LedgerHQ/ledger-live-desktop",
    reddit: "https://www.reddit.com/r/ledgerwallet/",
    facebook: "https://www.facebook.com/Ledger/",
  },
  // Campaigns
  promoNanoX:
    "https://www.ledger.com/pages/ledger-nano-x#utm_source=Ledger%20Live%20Desktop%20App&utm_medium=Ledger%20Live&utm_campaign=Ledger%20Live%20Desktop%20-%20Banner%20LNX",

  // Ledger support
  faq: "https://support.ledger.com/hc/en-us",
  syncErrors: "https://support.ledger.com/hc/en-us/articles/360012207759",
  terms: "https://www.ledger.com/pages/terms-of-use-and-disclaimer",
  noDevice: {
    buyNew:
      "https://shop.ledger.com/pages/hardware-wallets-comparison?utm_source=ledger_live&utm_medium=self_referral&utm_content=onboarding",
    learnMore:
      "https://www.ledger.com?utm_source=ledger_live&utm_medium=self_referral&utm_content=onboarding",
    learnMoreCrypto:
      "https://www.ledger.com/academy?utm_source=ledger_live&utm_medium=self_referral&utm_content=onboarding",
  },
  managerHelpRequest: "https://support.ledger.com/hc/en-us/articles/360006523674 ",
  contactSupport: "https://support.ledger.com/hc/en-us/requests/new?ticket_form_id=248165",
  feesMoreInfo: "https://support.ledger.com/hc/en-us/articles/360006535873",
  recipientAddressInfo: "https://support.ledger.com/hc/en-us/articles/360006444193",
  privacyPolicy: "https://www.ledger.com/pages/privacy-policy",
  troubleshootingUSB: "https://support.ledger.com/hc/en-us/articles/115005165269",
  troubleshootingCrash: "https://support.ledger.com/hc/en-us/articles/360012598060",
  appSupport: "https://support.ledger.com/hc/en-us/categories/115000811829-Apps",
  migrateAccounts: "https://support.ledger.com/hc/en-us/articles/360025321733",
  coinControl: "https://support.ledger.com/hc/en-us/articles/360015996580",
  githubIssues:
    "https://github.com/LedgerHQ/ledger-live-desktop/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Acomments-desc",
  multipleDestinationAddresses: "https://support.ledger.com/hc/en-us/articles/360033801034",
  updateDeviceFirmware: {
    nanoS: "https://support.ledger.com/hc/en-us/articles/360002731113",
    nanoX: "https://support.ledger.com/hc/en-us/articles/360013349800",
    blue: "https://support.ledger.com/hc/en-us/articles/360005885733",
  },
  lostPinOrSeed: {
    nanoS: "https://support.ledger.com/hc/en-us/articles/360000609933",
    nanoX: "https://support.ledger.com/hc/en-us/articles/360019097794",
    blue: "https://support.ledger.com/hc/en-us/articles/360000609933",
  },
  maxSpendable: "https://support.ledger.com/hc/en-us/articles/360012960679",
  stakingTezos: "https://www.ledger.com/staking-tezos",
  stakingTron: "https://www.ledger.com/staking-tron",
  stakingCosmos: "https://www.ledger.com/staking-cosmos",
  cosmosStakingRewards:
    "https://support.ledger.com/hc/en-us/articles/360014339340-Earn-Cosmos-staking-rewards",
  algorandStakingRewards: "https://support.ledger.com/hc/en-us/articles/360015897740",
  xpubLearnMore: "https://support.ledger.com/hc/en-us/articles/360011069619",

  // Banners
  banners: {
    backupPack:
      "https://shop.ledger.com/products/ledger-backup-pack?utm_source=ledger_live&utm_medium=self_referral&utm_content=banner_desktop",
    ledgerAcademy:
      "https://www.ledger.com/academy/?utm_source=ledger_live&utm_medium=self_referral&utm_content=banner_desktop",
  },
  helpModal: {
    gettingStarted:
      "https://www.ledger.com/start?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop",
    helpCenter:
      "https://support.ledger.com/hc/en-us?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop",
    ledgerAcademy:
      "https://www.ledger.com/academy/?utm_source=ledger_live&utm_medium=self_referral&utm_content=help_desktop",
    status: "https://status.ledger.com",
  },
  swap: {
    info: "https://www.ledger.com/swap",
    learnMore: "https://www.ledger.com/swap",
    providers: {
      changelly: {
        main: "https://changelly.com/",
        tos: "https://changelly.com/terms-of-use",
      },
    },
  },
  // Errors
  errors: {
    CantOpenDevice: "https://support.ledger.com/hc/en-us/articles/115005165269",
    WrongDeviceForAccount: "https://support.ledger.com/hc/en-us/articles/360025321733",
    SyncError: "https://support.ledger.com/hc/en-us/articles/360012109220",
    BitcoinCashHardforkOct2020Warning:
      "https://www.ledger.com/bitcoin-cash-fork-15-november-2020-what-it-means-for-you",
  },
  compound: "https://support.ledger.com/hc/en-us/articles/360017215099",
  compoundTnC: "https://shop.ledger.com/pages/ledger-live-terms-of-use",
  approvedOperation:
    "https://support.ledger.com/hc/en-us/articles/115005307809-Track-your-transaction",
};
