/* import { ITransportLib } from "@walletconnect/types"; */
import { ipcRenderer } from "electron";

// -- SocketTransport ------------------------------------------------------ //

class WebviewTransport /* implements ITransportLib */ {
  _events = [];
  connected = false;

  onMessage = (evt, message) => {
    console.log("msg", this.connected, evt, message);
    if (!this.connected) {
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
    console.log("OPEN AND LSITEND");
    this.connected = true;
    ipcRenderer.on("webviewtransport", this.onMessage);
  }

  close = () => {
    this.connected = false;
    this._events = [];
    console.log("STOP");
    ipcRenderer.removeListener("webviewtransport", this.onMessage);
  };

  send = (message, topic, silent) => {
    console.log("send", {
      topic: topic,
      type: "pub",
      payload: message,
      silent: !!silent,
    });
    ipcRenderer.sendToHost("webviewtransport", {
      topic: topic,
      type: "pub",
      payload: message,
      silent: !!silent,
    });
  };

  subscribe = topic => {
    console.log("subscribe", topic);
    ipcRenderer.sendToHost("webviewtransport", {
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
