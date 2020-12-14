import { Machine } from "xstate";

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
        },
      },
    },
    ownYourPrivateKey: {
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
      on: {
        PREV: {
          target: "validateTransactions",
        },
        DONE: {
          target: "accessYourCoins",
          actions: ["done"],
        },
      },
    },
  },
});
