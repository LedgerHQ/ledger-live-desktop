import initialize from "../../common.js";
import { accountsFlows, addAccount } from "./flows.js";

describe("tezos family", () => {
  initialize("tezos-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("tezos");
  accountsFlows("tezos");
});
