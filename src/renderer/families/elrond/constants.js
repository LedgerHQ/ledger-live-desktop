const type = "testnet";
const constants = {
  devnet: {
    explorer: "https://devnet-explorer.elrond.com",
    identities: "https://devnet-api.elrond.com/identities",
    delegations: "https://devnet-delegation-api.elrond.com",
    egldLabel: "xEGLD",
  },
  testnet: {
    explorer: "https://testnet-explorer.elrond.com",
    identities: "https://testnet-api.elrond.com/identities",
    delegations: "https://testnet-delegation-api.elrond.com",
    egldLabel: "xEGLD",
  },
  mainnet: {
    explorer: "https://explorer.elrond.com",
    identities: "https://api.elrond.com/identities",
    delegations: "https://delegation-api.elrond.com",
    egldLabel: "EGLD",
  },
}[type];

export { constants };
