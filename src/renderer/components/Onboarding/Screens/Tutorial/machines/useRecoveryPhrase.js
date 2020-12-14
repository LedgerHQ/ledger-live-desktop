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
    help: {},
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
          preferLedgerSeed: context.alerts.preferLedgerSeed === undefined,
        },
      })),
      on: {
        NEXT: {
          target: "deviceHowTo2",
        },
        PREV: {
          actions: ["topLevelPrev"],
        },
      },
    },
    deviceHowTo2: {
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
        HELP: {
          actions: assign({
            help: {
              pinCode: true,
            },
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
          target: "deviceHowTo2",
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
        HELP: {
          actions: assign({
            help: {
              pinCode: true,
            },
          }),
        },
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
        HELP: {
          actions: assign({
            help: {
              recoveryPhrase: true,
            },
          }),
        },
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
        HELP: {
          actions: assign({
            help: {
              recoveryPhrase: true,
            },
          }),
        },
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
        HELP: {
          actions: assign({
            help: {
              recoveryPhrase: true,
            },
          }),
        },
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
        GENUINE_CHECK_SUCCESS: {
          actions: [
            assign({
              device: (context, { device }) => device,
            }),
            "fireConfetti",
          ],
        },
        NEXT: {
          cond: context => context.device,
          actions: ["topLevelNext"],
        },
        PREV: {
          target: "pairMyNano",
        },
      },
    },
  },
  on: {
    SET_ALERT_STATUS: {
      actions: assign((context, { alertId, status }) => ({
        ...context,
        alerts: {
          ...context.alerts,
          [alertId]: status,
        },
      })),
    },
    SET_HELP_STATUS: {
      actions: assign((context, { helpId, status }) => ({
        ...context,
        help: {
          ...context.alerts,
          [helpId]: status,
        },
      })),
    },
  },
});
