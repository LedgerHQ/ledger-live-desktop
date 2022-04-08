import { assign, Machine } from "xstate";
import { setStepperStatus } from "./helpers";

export const connectSetupDevice = Machine({
  id: "connectSetupDevice",
  initial: "pairMyNano",
  context: {
    steps: [
      {
        id: "getStarted",
        status: "success",
      },
      {
        id: "pinCode",
        status: "success",
      },
      {
        id: "recoveryPhrase",
        status: "success",
      },
      {
        id: "hideRecoveryPhrase",
        status: "success",
      },
      {
        id: "pairNano",
        status: "active",
      },
    ],
    deviceId: null,
    alerts: {},
    help: {},
  },
  states: {
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
          actions: ["topLevelPrev"],
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
          cond: context => !!context.device,
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
