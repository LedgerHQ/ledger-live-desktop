// @flow

import { ipcRenderer } from "electron";

export const setLibcorePassword = (password: string) =>
  ipcRenderer.invoke("setLibcorePassword", { password });

export const changeLibcorePassword = (password: string) =>
  ipcRenderer.invoke("changeLibcorePassword", { password });
