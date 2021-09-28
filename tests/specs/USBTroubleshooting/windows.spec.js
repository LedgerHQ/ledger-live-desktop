import { generateTest } from "./common.js";
import initialize from "../../common.js";

describe(`USBTroubleshooting-windows`, () => {
  initialize("usbtroubleshooting", {
    userData: "1AccountBTC1AccountETH",
    env: { USBTROUBLESHOOTING_PLATFORM: "windows" },
  });
  generateTest("windows", 7);
});
