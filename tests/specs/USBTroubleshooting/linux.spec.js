import { generateTest } from "./common.js";
import initialize from "../../common.js";

describe(`USBTroubleshooting-linux`, () => {
  initialize("usbtroubleshooting", {
    userData: "1AccountBTC1AccountETH",
    env: { USBTROUBLESHOOTING_PLATFORM: "linux" },
  });
  generateTest("linux", 6);
});
