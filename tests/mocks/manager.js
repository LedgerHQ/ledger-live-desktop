// @flow
import manager from "@ledgerhq/live-common/lib/manager";
// import utils from "./utils";

// const OGgetLatestFirmwareForDevice = manager.getLatestFirmwareForDevice.bind(manager);
manager.getLatestFirmwareForDevice = async deviceInfo => {
  return require("./data/firmware.json");
};
