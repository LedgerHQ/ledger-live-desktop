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
      on: {
        NEXT: {
          target: "ownYourPrivateKey",
          actions: () => track("Onboarding - Edu step 1"),
        },
      },
    },
    ownYourPrivateKey: {
      on: {
        NEXT: {
          target: "stayOffline",
          actions: () => track("Onboarding - Edu step 2"),
        },
        PREV: {
          target: "accessYourCoins",
        },
      },
    },
    stayOffline: {
      on: {
        NEXT: {
          target: "validateTransactions",
          actions: () => track("Onboarding - Edu step 3"),
        },
        PREV: {
          target: "ownYourPrivateKey",
        },
      },
    },
    validateTransactions: {
      on: {
        NEXT: {
          target: "setUpNanoWallet",
          actions: () => track("Onboarding - Edu step 4"),
        },
        PREV: {
          target: "stayOffline",
        },
      },
    },
    setUpNanoWallet: {
      on: {
        PREV: {
          target: "validateTransactions",
        },
        DONE: {
          target: "accessYourCoins",
          actions: ["done", () => track("Onboarding - Edu completed")],
        },
      },
    },
  },
});
