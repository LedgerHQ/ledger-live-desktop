import { assign, Machine } from "xstate";
import { setStepperStatus } from "./helpers";

export const setupNewDevice = Machine({
  id: "setupNewDevice",
  initial: "howToGetStarted",
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
        id: "hideRecoveryPhrase",
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
    deviceId: null,
    alerts: {},
    help: {},
  },
  states: {
    howToGetStarted: {
      entry: setStepperStatus({
        getStarted: "active",
        pinCode: "inactive",
        recoveryPhrase: "inactive",
        hideRecoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      exit: assign(context => ({
        ...context,
        alerts: {
          beCareful: context.alerts.beCareful === undefined,
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
        hideRecoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "pinCode",
        },
        PREV: {
          target: "howToGetStarted",
        },
      },
    },
    pinCode: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "active",
        recoveryPhrase: "inactive",
        hideRecoveryPhrase: "inactive",
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
        HELP: {
          actions: assign({
            help: {
              pinCode: true,
            },
          }),
        },
      },
    },
    pinCodeHowTo: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "active",
        recoveryPhrase: "inactive",
        hideRecoveryPhrase: "inactive",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "newRecoveryPhrase",
        },
        PREV: {
          target: "pinCode",
        },
        HELP: {
          actions: assign({
            help: {
              pinCode: true,
            },
          }),
        },
      },
    },
    newRecoveryPhrase: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        hideRecoveryPhrase: "inactive",
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
          target: "useRecoverySheet",
          cond: context => context.userUnderstandConsequences,
        },
        PREV: {
          target: "pinCodeHowTo",
        },
      },
    },
    useRecoverySheet: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        hideRecoveryPhrase: "inactive",
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
          target: "recoveryHowTo3",
        },
        PREV: {
          target: "newRecoveryPhrase",
        },
      },
    },
    recoveryHowTo3: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "active",
        hideRecoveryPhrase: "inactive",
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
          target: "hideRecoveryPhrase",
        },
        PREV: {
          target: "useRecoverySheet",
        },
      },
    },
    hideRecoveryPhrase: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        hideRecoveryPhrase: "active",
        pairNano: "inactive",
      }),
      exit: assign({
        quizzOpen: false,
      }),
      on: {
        HELP: {
          actions: assign({
            help: {
              hideRecoveryPhrase: true,
            },
          }),
        },
        NEXT: {
          actions: assign({
            quizzOpen: true,
          }),
        },
        PREV: {
          target: "recoveryHowTo3",
        },
        QUIZ_SUCCESS: {
          target: "quizSuccess",
        },
        QUIZ_FAILURE: {
          target: "quizFailure",
        },
      },
    },
    quizSuccess: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        hideRecoveryPhrase: "active",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "pairMyNano",
        },
        PREV: {
          target: "hideRecoveryPhrase",
        },
      },
    },
    quizFailure: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        hideRecoveryPhrase: "active",
        pairNano: "inactive",
      }),
      on: {
        NEXT: {
          target: "pairMyNano",
        },
        PREV: {
          target: "hideRecoveryPhrase",
        },
      },
    },
    pairMyNano: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        hideRecoveryPhrase: "success",
        pairNano: "active",
      }),
      on: {
        NEXT: {
          target: "genuineCheck",
        },
        PREV: {
          target: "hideRecoveryPhrase",
        },
      },
    },
    genuineCheck: {
      entry: setStepperStatus({
        getStarted: "success",
        pinCode: "success",
        recoveryPhrase: "success",
        hideRecoveryPhrase: "success",
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
