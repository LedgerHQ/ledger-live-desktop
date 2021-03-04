import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsWithTokenFlows } from "./flows.js";

describe("ethereum family", () => {
  initialize("ethereum-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("ethereum");
  accountsWithTokenFlows("ethereum");
});
