// @flow

const { ipcRenderer, contextBridge } = require("electron");

console.log("LOADED !!");

contextBridge.exposeInMainWorld("ElectronWebview", {
  postMessage: (message: any) => ipcRenderer.sendToHost("webviewToParent", message),
});
