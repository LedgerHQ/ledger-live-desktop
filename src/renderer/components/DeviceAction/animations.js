// @flow
import type { DeviceModelId } from "@ledgerhq/devices";

const nanoS = {
  plugAndPinCode: {
    light: require("~/renderer/animations/nanoS/1PlugAndPinCode/light.json"),
    dark: require("~/renderer/animations/nanoS/1PlugAndPinCode/dark.json"),
  },
  enterPinCode: {
    light: require("~/renderer/animations/nanoS/3EnterPinCode/light.json"),
    dark: require("~/renderer/animations/nanoS/3EnterPinCode/dark.json"),
  },
  quitApp: {
    light: require("~/renderer/animations/nanoS/4QuitApp/light.json"),
    dark: require("~/renderer/animations/nanoS/4QuitApp/dark.json"),
  },
  allowManager: {
    light: require("~/renderer/animations/nanoS/5AllowManager/light.json"),
    dark: require("~/renderer/animations/nanoS/5AllowManager/dark.json"),
  },
  openApp: {
    light: require("~/renderer/animations/nanoS/6OpenApp/light.json"),
    dark: require("~/renderer/animations/nanoS/6OpenApp/dark.json"),
  },
  validate: {
    light: require("~/renderer/animations/nanoS/7Validate/light.json"),
    dark: require("~/renderer/animations/nanoS/7Validate/dark.json"),
  },
  firmwareUpdating: {
    light: require("~/renderer/animations/nanoS/2FirmwareUpdating/light.json"),
    dark: require("~/renderer/animations/nanoS/2FirmwareUpdating/dark.json"),
  },
};
const nanoX = {
  plugAndPinCode: {
    light: require("~/renderer/animations/nanoX/1PlugAndPinCode/light.json"),
    dark: require("~/renderer/animations/nanoX/1PlugAndPinCode/dark.json"),
  },
  enterPinCode: {
    light: require("~/renderer/animations/nanoX/3EnterPinCode/light.json"),
    dark: require("~/renderer/animations/nanoX/3EnterPinCode/dark.json"),
  },
  quitApp: {
    light: require("~/renderer/animations/nanoX/4QuitApp/light.json"),
    dark: require("~/renderer/animations/nanoX/4QuitApp/dark.json"),
  },
  allowManager: {
    light: require("~/renderer/animations/nanoX/5AllowManager/light.json"),
    dark: require("~/renderer/animations/nanoX/5AllowManager/dark.json"),
  },
  openApp: {
    light: require("~/renderer/animations/nanoX/6OpenApp/light.json"),
    dark: require("~/renderer/animations/nanoX/6OpenApp/dark.json"),
  },
  validate: {
    light: require("~/renderer/animations/nanoX/7Validate/light.json"),
    dark: require("~/renderer/animations/nanoX/7Validate/dark.json"),
  },
  firmwareUpdating: {
    light: require("~/renderer/animations/nanoX/2FirmwareUpdating/light.json"),
    dark: require("~/renderer/animations/nanoX/2FirmwareUpdating/dark.json"),
  },
};

const nanoSP = {
  plugAndPinCode: {
    light: require("~/renderer/animations/nanoSP/1PlugAndPinCode/light.json"),
    dark: require("~/renderer/animations/nanoSP/1PlugAndPinCode/dark.json"),
  },
  enterPinCode: {
    light: require("~/renderer/animations/nanoSP/3EnterPinCode/light.json"),
    dark: require("~/renderer/animations/nanoSP/3EnterPinCode/dark.json"),
  },
  quitApp: {
    light: require("~/renderer/animations/nanoSP/4QuitApp/light.json"),
    dark: require("~/renderer/animations/nanoSP/4QuitApp/dark.json"),
  },
  allowManager: {
    light: require("~/renderer/animations/nanoSP/5AllowManager/light.json"),
    dark: require("~/renderer/animations/nanoSP/5AllowManager/dark.json"),
  },
  openApp: {
    light: require("~/renderer/animations/nanoSP/6OpenApp/light.json"),
    dark: require("~/renderer/animations/nanoSP/6OpenApp/dark.json"),
  },
  validate: {
    light: require("~/renderer/animations/nanoSP/7Validate/light.json"),
    dark: require("~/renderer/animations/nanoSP/7Validate/dark.json"),
  },
  firmwareUpdating: {
    light: require("~/renderer/animations/nanoSP/2FirmwareUpdating/light.json"),
    dark: require("~/renderer/animations/nanoSP/2FirmwareUpdating/dark.json"),
  },
};

const blue = {
  plugAndPinCode: {
    light: require("~/renderer/animations/blue/1PlugAndPinCode/data.json"),
  },
  enterPinCode: {
    light: require("~/renderer/animations/blue/3EnterPinCode/data.json"),
  },
  quitApp: {
    light: require("~/renderer/animations/blue/4QuitApp/data.json"),
  },
  allowManager: {
    light: require("~/renderer/animations/blue/5AllowManager/data.json"),
  },
  openApp: {
    light: require("~/renderer/animations/blue/6OpenApp/data.json"),
  },
  validate: {
    light: require("~/renderer/animations/blue/7Validate/data.json"),
  },
  // Nb We are dropping the assets for blue soon, this is temp
  firmwareUpdating: {
    light: require("~/renderer/animations/nanoS/2FirmwareUpdating/light.json"),
    dark: require("~/renderer/animations/nanoS/2FirmwareUpdating/dark.json"),
  },
};

const animations = { nanoX, nanoS, nanoSP, blue };

type InferredKeys = $Keys<typeof nanoS>;

export const getDeviceAnimation = (
  modelId: DeviceModelId,
  theme: "light" | "dark",
  key: InferredKeys,
) => {
  // $FlowFixMe Ignore the type to allow override from env.
  modelId = process.env.OVERRIDE_MODEL_ID || modelId;
  const lvl1 = animations[modelId] || animations.nanoX;
  const lvl2 = lvl1[key] || animations.nanoX[key];
  if (theme === "dark" && lvl2.dark) return lvl2.dark;
  return lvl2.light;
};
