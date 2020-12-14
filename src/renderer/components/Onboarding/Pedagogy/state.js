import { Machine } from "xstate";
import { track } from "~/renderer/analytics/segment";

export const pedagogyMachine = Machine({
  id: "pedagogy",
  initial: "accessYourCoins",
  context: {
    opened: false,
  },
  states: {
    accessYourCoins: {
      entry: () => track("Onboarding - Edu step 1"),
      on: {
        NEXT: {
          target: "ownYourPrivateKey",
        },
      },
    },
    ownYourPrivateKey: {
      entry: () => track("Onboarding - Edu step 2"),
      on: {
        NEXT: {
          target: "stayOffline",
        },
        PREV: {
          target: "accessYourCoins",
        },
      },
    },
    stayOffline: {
      entry: () => track("Onboarding - Edu step 3"),
      on: {
        NEXT: {
          target: "validateTransactions",
        },
        PREV: {
          target: "ownYourPrivateKey",
        },
      },
    },
    validateTransactions: {
      entry: () => track("Onboarding - Edu step 4"),
      on: {
        NEXT: {
          target: "setUpNanoWallet",
        },
        PREV: {
          target: "stayOffline",
        },
      },
    },
    setUpNanoWallet: {
      entry: () => track("Onboarding - Edu step 5"),
      on: {
        PREV: {
          target: "validateTransactions",
        },
        DONE: {
          target: "accessYourCoins",
          actions: [
            "done",
            () => track("Onboarding - Edu completed")
          ],
        },
      },
    },
  },
});
