// @flow

import { ipcRenderer } from "electron";
import accountModel from "~/helpers/accountModel";
import memoize from "lodash/memoize";
import debounce from "lodash/debounce";

/*
  This file serve as an interface for the RPC binding to the main thread that now manage the config file.
  Because only serialized json can be sent between processes, the transform system now live here.
 */

const transforms = {};

transforms.accounts = {
  get: (raws: *) => {
    // NB to prevent parsing encrypted string as JSON
    if (typeof raws === "string") return null;
    return (raws || []).map(accountModel.decode);
  },
  set: (accounts: *) => (accounts || []).map(accountModel.encode),
};

export const getKey = async (ns: string, keyPath: string, defaultValue: any) => {
  let data = await ipcRenderer.invoke("getKey", { ns, keyPath, defaultValue });

  const transform = transforms[keyPath];
  if (transform) {
    data = transform.get(data);
  }

  return data;
};

const debouncedSetKey = memoize(
  (ns: string, keyPath: string) =>
    debounce((value: string) => {
      const transform = transforms[keyPath];
      ipcRenderer.invoke("setKey", {
        ns,
        keyPath,
        value: transform ? transform.set(value) : value,
      });
    }, 1000),
  (ns: string, keyPath: string) => `${ns}:${keyPath}`,
);

export const setKey = (ns: string, keyPath: string, value: any) => {
  debouncedSetKey(ns, keyPath)(value);
};

export const hasEncryptionKey = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("hasEncryptionKey", { ns, keyPath });

export const setEncryptionKey = (ns: string, keyPath: string, encryptionKey: string) =>
  ipcRenderer.invoke("setEncryptionKey", { ns, keyPath, encryptionKey });

export const removeEncryptionKey = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("removeEncryptionKey", { ns, keyPath });

export const isEncryptionKeyCorrect = (ns: string, keyPath: string, encryptionKey: string) =>
  ipcRenderer.invoke("isEncryptionKeyCorrect", { ns, keyPath, encryptionKey });

export const hasBeenDecrypted = (ns: string, keyPath: string) =>
  ipcRenderer.invoke("hasBeenDecrypted", { ns, keyPath });

export const resetAll = () => ipcRenderer.invoke("resetAll");

export const reload = () => ipcRenderer.invoke("reload");

export const cleanCache = () => ipcRenderer.invoke("cleanCache");
