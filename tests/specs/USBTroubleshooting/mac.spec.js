import { generateTest } from "./common.js";
import initialize from "../../common.js";

describe(`USBTroubleshooting-mac`, () => {
  initialize("usbtroubleshooting", {
    userData: "1AccountBTC1AccountETH",
    env: { USBTROUBLESHOOTING_PLATFORM: "mac" },
  });
  generateTest("mac", 7);
});
