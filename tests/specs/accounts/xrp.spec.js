import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsFlows } from "./flows.js";

describe("xrp family", () => {
  initialize("xrp-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("xrp");
  accountsFlows("xrp");
});
