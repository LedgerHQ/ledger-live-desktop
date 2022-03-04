// @flow

const { ipcRenderer, contextBridge } = require("electron");

const postMessage = (message: any) => ipcRenderer.sendToHost("webviewToParent", message);

contextBridge.exposeInMainWorld("ledger", {
  setToken: (token: string) => {
    const message = JSON.stringify({
      type: "setToken",
      token,
    });
    console.log({ message });
    postMessage(message);
  },

  closeWidget: () => {
    const message = JSON.stringify({
      type: "closeWidget",
    });
    console.log({ message });
    postMessage(message);
  },
});
