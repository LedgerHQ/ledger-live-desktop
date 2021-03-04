import initialize from "../../common.js";
import { globalAccountsFlows } from "./flows.js";

describe("global accounts flows", () => {
  initialize("global-accounts", {
    userData: "1AccountBTC1AccountETH",
  });

  globalAccountsFlows();
});
