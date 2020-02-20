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
};

const animations = { nanoX, nanoS, blue };

type InferredKeys = $Keys<typeof nanoS>;

export const getDeviceAnimation = (
  modelId: DeviceModelId,
  theme: "light" | "dark",
  key: InferredKeys,
) => {
  const lvl1 = animations[modelId] || animations.nanoX;
  const lvl2 = lvl1[key] || animations.nanoX[key];
  if (theme === "dark" && lvl2.dark) return lvl2.dark;
  return lvl2.light;
};
