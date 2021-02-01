import initialize from "../../common.js";
import addAccount from "../../flows/accounts/addAccount";
import { accountsFlows } from "./flows.js";

describe("tezos family", () => {
  initialize("tezos-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("tezos");
  accountsFlows("tezos");
});
