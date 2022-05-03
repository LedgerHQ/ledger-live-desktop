const type = "mainnet";
const modals = {
  rewards: "MODAL_ELROND_REWARDS_INFO",
  claim: "MODAL_ELROND_CLAIM_REWARDS",
  stake: "MODAL_ELROND_DELEGATE",
  unstake: "MODAL_ELROND_UNDELEGATE",
  withdraw: "MODAL_ELROND_WITHDRAW",
};

const constants = {
  devnet: {
    explorer: "https://devnet-explorer.elrond.com",
    identities: "https://devnet-api.elrond.com/identities",
    delegations: "https://devnet-delegation-api.elrond.com",
    egldLabel: "xEGLD",
    modals,
  },
  testnet: {
    explorer: "https://testnet-explorer.elrond.com",
    identities: "https://testnet-api.elrond.com/identities",
    delegations: "https://testnet-delegation-api.elrond.com",
    egldLabel: "xEGLD",
    modals,
  },
  mainnet: {
    explorer: "https://explorer.elrond.com",
    identities: "https://api.elrond.com/identities",
    delegations: "https://delegation-api.elrond.com",
    egldLabel: "EGLD",
    modals,
  },
}[type];

export { constants };
