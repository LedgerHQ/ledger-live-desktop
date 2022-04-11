const type = "mainnet";
const constants = {
  devnet: {
    explorer: "https://devnet-explorer.elrond.com",
    identities: "https://devnet-api.elrond.com/identities",
    egldLabel: "xEGLD",
  },
  testnet: {
    explorer: "https://testnet-explorer.elrond.com",
    identities: "https://testnet-api.elrond.com/identities",
    egldLabel: "xEGLD",
  },
  mainnet: {
    explorer: "https://explorer.elrond.com",
    identities: "https://api.elrond.com/identities",
    egldLabel: "EGLD",
  },
}[type];

export { constants };
