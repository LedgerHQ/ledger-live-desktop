// @flow
import { ipcRenderer } from "electron";
import resolveUserDataDirectory from "~/helpers/resolveUserDataDirectory";
import { setEnvOnAllThreads } from "~/helpers/env";
import {
  editSatsStackConfig,
  stringifySatsStackConfig,
  parseSatsStackConfig,
} from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { SatsStackConfig } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import path from "path";
const lssFileName = "lss.json";

export const saveLSS = async (lssConfig: SatsStackConfig) => {
  const userDataDirectory = resolveUserDataDirectory();
  const filePath = path.resolve(userDataDirectory, lssFileName);

  if (filePath) {
    const configStub = {
      node: { host: "", username: "", password: "" },
      accounts: [],
    };
    const maybeExistingConfig = (await loadLSS()) || configStub;
    const updated = editSatsStackConfig(maybeExistingConfig || { accounts: [] }, lssConfig);
    await ipcRenderer.invoke("generate-lss-config", filePath, stringifySatsStackConfig(updated));
    setEnvOnAllThreads("SATSTACK", true);
  }
};

export const removeLSS = async () => {
  const userDataDirectory = resolveUserDataDirectory();
  const filePath = path.resolve(userDataDirectory, lssFileName);

  if (filePath) {
    await ipcRenderer.invoke("delete-lss-config", filePath);
    setEnvOnAllThreads("SATSTACK", false);
  }
};

export const loadLSS = async (): Promise<?SatsStackConfig> => {
  const userDataDirectory = resolveUserDataDirectory();
  const filePath = path.resolve(userDataDirectory, lssFileName);

  if (filePath) {
    const satStackConfigRaw = await ipcRenderer.invoke("load-lss-config", filePath);
    try {
      const config = parseSatsStackConfig(satStackConfigRaw);
      setEnvOnAllThreads("SATSTACK", true);
      return config;
    } catch (e) {
      // Bad data from the file for instance.
    }
  }
  return null;
};
