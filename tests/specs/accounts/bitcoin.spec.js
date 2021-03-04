import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsFlows } from "./flows.js";

describe("bitcoin family", () => {
  initialize("bitcoin-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("bitcoin");
  accountsFlows("bitcoin");
});
