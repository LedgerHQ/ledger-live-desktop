import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsFlows } from "./flows.js";

describe("cosmos family", () => {
  initialize("cosmos-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("cosmos");
  accountsFlows("cosmos");
});
