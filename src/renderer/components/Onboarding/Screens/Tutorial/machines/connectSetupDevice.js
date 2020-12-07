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
