import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletConnectCore from "@walletconnect/core";
import * as cryptoLib from "@walletconnect/iso-crypto";
import { ipcRenderer } from "electron";
import IPCTransportWebview from "./ipctransportwebview";

console.log("ledger live provider loaded");

let session;
const sessionStorage = {
  getSession: () => {
    return session;
  },
  setSession: s => {
    session = s;
    return session;
  },
  removeSession: () => {
    session = null;
  },
};

const provider = new WalletConnectProvider({
  infuraId: "c5f470b29f9946feb13a80a8a4f8faf4", // Required
  connector: new WalletConnectCore({
    cryptoLib,
    connectorOpts: {
      bridge: "ipc",
      qrcodeModal: undefined,
    },
    transport: new IPCTransportWebview(),
    sessionStorage,
  }),
});

window.ethereum = provider;

provider.connector.on("display_uri", (err, payload) => {
  if (err) {
    return;
  }
  const uri = payload.params[0];
  console.log("display uri event handler", uri);
  ipcRenderer.sendToHost("dappuri", uri);
});

provider.start();
