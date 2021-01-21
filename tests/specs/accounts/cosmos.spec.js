import initialize from "../../common.js";
import { accountsFlows, addAccount } from "./flows.js";

describe("cosmos family", () => {
  initialize("cosmos-accounts", {
    userData: "onboardingcompleted",
  });

  addAccount("cosmos");
  accountsFlows("cosmos");
});
