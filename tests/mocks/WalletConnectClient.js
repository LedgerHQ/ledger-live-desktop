/* @flow */
import EventEmitter from "events";

class WalletConnectClient extends EventEmitter {
  session: *;
  _transport: *;

  constructor() {
    super();
    this._transport = {
      _socket: {
        readyState: 1,
      },
    };
    this.session = null;
    window.WCinstance = this;
  }

  rejectRequest() {}

  approveRequest() {}

  killSession() {
    this.session = null;
    this._transport = null;
    delete window.WCinstance;
  }

  approveSession(session: *) {
    this.session = { ...session };
    this.connect();
  }

  // for tests
  requestSession() {
    const payload = {
      id: 1617871203382451,
      jsonrpc: "2.0",
      method: "session_request",
      params: [
        {
          peerId: "3cb9683c-c970-4f14-ac8e-3889fd1ed363",
          peerMeta: {
            description: "",
            url: "https://example.walletconnect.org",
            icons: ["https://example.walletconnect.org/favicon.ico"],
            name: "WalletConnect Example",
          },
          chainId: null,
        },
      ],
    };

    this.emit("session_request", null, payload);
  }

  connect() {
    this.session = {
      ...this.session,
      connected: true,
      bridge: "https://bridge.walletconnect.org",
      key: "3b43c6d2b93e472ddd86a84308d35df2c0ad05b9b08e5b76a73da6695b692e79",
      clientId: "604fdcfc-87a6-436e-8a53-0e46e00cd4fa",
      clientMeta: { description: "", url: "http://localhost:8080", icons: [], name: "Ledger Live" },
      peerId: "3cb9683c-c970-4f14-ac8e-3889fd1ed363",
      peerMeta: {
        description: "",
        url: "https://example.walletconnect.org",
        icons: ["https://example.walletconnect.org/favicon.ico"],
        name: "WalletConnect Example",
      },
      handshakeId: 1617871203382451,
      handshakeTopic: "22b1a881-03e4-4d5b-8b76-4ec02c9dd9ab",
    };

    this.emit("connect");
  }

  sendTransaction() {
    this.emit("call_request", null, {
      id: 1617871223182056,
      jsonrpc: "2.0",
      method: "eth_sendTransaction",
      params: [
        {
          // $FlowFixMe
          from: this.session.accounts[0],
          to: "0xCA220B75b7aF206bFCc67E2EcE06E2e144FA294a",
          gasPrice: "0x161e70f600",
          gas: "0x5208",
          value: "0x0",
          nonce: "0x1d",
          data: "0x",
        },
      ],
    });
  }

  signMessage() {
    this.emit("call_request", null, {
      id: 1617871234761141,
      jsonrpc: "2.0",
      method: "personal_sign",
      params: [
        "0x4d7920656d61696c206973206a6f686e40646f652e636f6d202d2031353337383336323036313031",
        // $FlowFixMe
        this.session.accounts[0],
      ],
    });
  }
}

export default WalletConnectClient;
