import initialize from "../../common.js";
import { accountsWithTokenFlows, addAccount } from "./flows.js";

describe("ethereum family", () => {
  // describe("emtpy state", () => {});
  initialize("ethereum-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("ethereum");
  accountsWithTokenFlows("ethereum");
});
