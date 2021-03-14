// import { ITransportLib } from "@walletconnect/types";

// -- SocketTransport ------------------------------------------------------ //

class WebviewTransport /* implements ITransportLib */ {
  constructor({ webview }) {
    this.webview = webview;
    this._events = [];
    this.connected = false;
  }

  onMessage = evt => {
    console.log("msg", this.connected, event);
    if (!this.connected) {
      return;
    }
    const {
      args: [message],
      channel,
    } = evt;
    if (channel !== "webviewtransport") {
      return;
    }
    const events = this._events.filter(event => event.event === "message");
    if (events && events.length) {
      events.forEach(event => event.callback(message));
    }
  };

  open() {
    if (this.connected) {
      throw new Error("WebviewTransport already connected");
    }
    this.connected = true;
    this.webview.addEventListener("ipc-message", this.onMessage);
  }

  close = () => {
    this.connected = false;
    this._events = [];
    this.webview.removeListener("ipc-message", this.onMessage);
  };

  send = (message, topic, silent) => {
    console.log("send", {
      topic: topic,
      type: "pub",
      payload: message,
      silent: !!silent,
    });
    this.webview.send("webviewtransport", {
      topic: topic,
      type: "pub",
      payload: message,
      silent: !!silent,
    });
  };

  subscribe = topic => {
    console.log("subscribe", topic);
    this.webview.send("webviewtransport", {
      topic: topic,
      type: "sub",
      payload: "",
      silent: true,
    });
  };

  on = (event, callback) => {
    this._events.push({ event, callback });
  };
}

export default WebviewTransport;
