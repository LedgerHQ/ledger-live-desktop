import initialize from "../../common.js";
import { accountsFlows, addAccount } from "./flows.js";

describe("xrp family", () => {
  initialize("xrp-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("xrp");
  accountsFlows("xrp");
});
