// @flow

const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("ElectronWebview", {
  postMessage: (message: any) => ipcRenderer.sendToHost("webviewToParent", message),
});
