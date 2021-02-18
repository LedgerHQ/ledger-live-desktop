import { assign, Machine } from "xstate";
import { setStepperStatus } from "./helpers";
import { track } from "~/renderer/analytics/segment";

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
          actions: () => track("Onboarding - Get started step 1"),
        },
        PREV: {
          actions: "topLevelPrev",
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
          actions: () => track("Onboarding - Get started step 2"),
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
          actions: () => track("Onboarding - Pin code step 1"),
          target: "pinCodeHowTo",
          cond: context => context.userChosePincodeHimself,
        },
        PREV: {
          target: "deviceHowTo",
        },
        HELP: {
          actions: [
            () => track("Onboarding - Pin code step 1 - HELP CLICK"),
            assign({
              help: {
                pinCode: true,
              },
            }),
          ],
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
          actions: () => track("Onboarding - Pin code step 2"),
        },
        PREV: {
          target: "pinCode",
        },
        HELP: {
          actions: [
            () => track("Onboarding - Pin code step 2 - HELP CLICK"),
            assign({
              help: {
                pinCode: true,
              },
            }),
          ],
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
          actions: [
            () => track("Onboarding - Recovery step 1 - HELP CLICK"),
            assign({
              help: {
                recoveryPhrase: true,
              },
            }),
          ],
        },
        RECOVERY_TERMS_CHANGED: {
          actions: assign({
            userUnderstandConsequences: (_, event) => event.value,
          }),
        },
        NEXT: {
          target: "useRecoverySheet",
          actions: () => track("Onboarding - Recovery step 1"),
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
          actions: [
            () => track("Onboarding - Recovery step 2 - HELP CLICK"),
            assign({
              help: {
                recoveryPhrase: true,
              },
            }),
          ],
        },
        NEXT: {
          target: "recoveryHowTo3",
          actions: () => track("Onboarding - Recovery step 2"),
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
          actions: [
            () => track("Onboarding - Recovery step 3 - HELP CLICK"),
            assign({
              help: {
                recoveryPhrase: true,
              },
            }),
          ],
        },
        NEXT: {
          target: "hideRecoveryPhrase",
          actions: () => track("Onboarding - Recovery step 3"),
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
          actions: [
            () => track("Onboarding - Recovery step 4 - HELP CLICK"),
            assign({
              help: {
                hideRecoveryPhrase: true,
              },
            }),
          ],
        },
        NEXT: {
          actions: [
            assign({
              quizzOpen: true,
            }),
            () => track("Onboarding - Recovery step 4"),
          ],
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
          actions: () => track("Onboarding - Pair start"),
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
          actions: () => track("Onboarding - Pair start"),
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
          actions: () => track("Onboarding - Genuine Check"),
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
