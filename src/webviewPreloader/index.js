// @flow

const { ipcRenderer } = require("electron");

console.log("LOADED !!");

window.ElectronWebview = {
  postMessage: (message: any) => ipcRenderer.sendToHost("webviewToParent", message),
};
