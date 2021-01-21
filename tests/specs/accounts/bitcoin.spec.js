import initialize from "../../common.js";
import { accountsFlows, addAccount } from "./flows.js";

describe("bitcoin family", () => {
  initialize("bitcoin-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("bitcoin");
  accountsFlows("bitcoin");
});
