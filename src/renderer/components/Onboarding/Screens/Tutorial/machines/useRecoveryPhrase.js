import { assign, Machine } from "xstate";
import { setStepperStatus } from "./helpers";

export const useRecoveryPhraseMachine = Machine({
  id: "useRecoveryPhrase",
  initial: "importRecoveryPhrase",
  context: {
    steps: [
      {
        id: "getStarted",
        status: "active",
      },
      {
        id: "pinCode",
        status: "inactive",
      },
      {
        id: "recoveryPhrase",
        status: "inactive",
      },
      {
        id: "pairNano",
        status: "inactive",
      },
    ],
    userChosePincodeHimself: false,
    userUnderstandConsequences: false,
    drawer: null,
    alerts: {},
  },
  states: {
    importRecoveryPhrase: {
      entry: setStepperStatus({
        getStarted: "active",
        pinCode: "inactive",
        recoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      exit: assign(context => ({
        ...context,
        alerts: {
          preferLedgerSeed: context.alerts.preferLedgerSeed === undefined ? true : context.alerts.preferLedgerSeed,
        },
      })),
      on: {
        NEXT: {
          target: "deviceHowTo",
        },
        PREV: {
          actions: ["topLevelPrev"],
        },
      },
    },
    deviceHowTo: {
      entry: setStepperStatus({
        getStarted: "active",
        pinCode: "inactive",
        recoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "pinCode",
        },
        PREV: {
          target: "importRecoveryPhrase",
        },
      },
    },
    pinCode: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "active",
        recoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      on: {
        OPEN_DRAWER: {
          actions: assign({
            drawer: "pinCodeHelp",
          }),
        },
        PINCODE_TERMS_CHANGED: {
          actions: assign({
            userChosePincodeHimself: (_, event) => event.value,
          }),
        },
        NEXT: {
          target: "pinCodeHowTo",
          cond: context => context.userChosePincodeHimself,
        },
        PREV: {
          target: "deviceHowTo",
        },
      },
    },
    pinCodeHowTo: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "active",
        recoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "existingRecoveryPhrase",
        },
        PREV: {
          target: "pinCode",
        },
      },
    },
    existingRecoveryPhrase: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        pairNano: "inactive",
      }),
      on: {
        RECOVERY_TERMS_CHANGED: {
          actions: assign({
            userUnderstandConsequences: (_, event) => event.value,
          }),
        },
        NEXT: {
          target: "recoveryHowTo1",
          cond: context => context.userUnderstandConsequences,
        },
        PREV: {
          target: "pinCodeHowTo",
        },
      },
    },
    recoveryHowTo1: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "recoveryHowTo2",
        },
        PREV: {
          target: "existingRecoveryPhrase",
        },
      },
    },
    recoveryHowTo2: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "pairMyNano",
        },
        PREV: {
          target: "recoveryHowTo1",
        },
      },
    },
    pairMyNano: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        pairNano: "active",
      }),
      on: {
        NEXT: {
          target: "genuineCheck",
        },
        PREV: {
          target: "recoveryHowTo2",
        },
      },
    },
    genuineCheck: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        pairNano: "active",
      }),
      on: {
        SET_DEVICE_ID: {
          actions: assign({
            deviceId: (_, { deviceId }) => deviceId,
          }),
        },
        NEXT: {
          cond: context => context.deviceId,
        },
        PREV: {
          target: "pairMyNano",
        },
      },
    },

  },
  on: {
    CLOSE_DRAWER: {
      actions: assign({
        drawer: null,
      }),
    },
    SET_ALERT_STATUS: {
      actions: assign((context, { alertId, status }) => ({
        ...context,
        alerts: {
          ...context.alerts,
          [alertId]: status,
        },
      })),
    },
  },
});
