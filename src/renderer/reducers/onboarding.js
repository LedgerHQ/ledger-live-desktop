// @flow

import type { DeviceModelId } from "@ledgerhq/devices";
import { handleActions } from "redux-actions";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import type { State } from ".";

type Step = {
  name: string,
  external?: boolean,
  label?: string,
  options: {
    showBreadcrumb: boolean,
    relaunchSkip?: boolean,
    alreadyInitSkip?: boolean,
  },
};

export type OnboardingState = {
  stepIndex: number,
  stepName: string, // TODO: specify that the string comes from Steps type
  steps: Step[],
  genuine: {
    isDeviceGenuine: boolean,
    displayErrorScreen: boolean,
  },
  deviceModelId: ?DeviceModelId,
  flowType: string,
  onboardingRelaunched?: boolean,
};

const initialState: OnboardingState = {
  stepIndex: 0,
  stepName: getEnv("SKIP_ONBOARDING") ? "analytics" : "start",
  genuine: {
    isDeviceGenuine: false,
    displayErrorScreen: false,
  },
  deviceModelId: null,
  flowType: "",
  onboardingRelaunched: false,
  steps: [
    {
      name: "start",
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: "init",
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: "noDevice",
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: "selectDevice",
      label: "onboarding.breadcrumb.selectDevice",
      options: {
        showBreadcrumb: true,
      },
    },
    {
      name: "selectPIN",
      label: "onboarding.breadcrumb.selectPIN",
      options: {
        showBreadcrumb: true,
        alreadyInitSkip: true,
      },
    },
    {
      name: "writeSeed",
      label: "onboarding.breadcrumb.writeSeed",
      options: {
        showBreadcrumb: true,
        alreadyInitSkip: true,
      },
    },
    {
      name: "genuineCheck",
      label: "onboarding.genuineCheck.title",
      options: {
        showBreadcrumb: true,
      },
    },
    {
      name: "setPassword",
      label: "onboarding.breadcrumb.setPassword",
      options: {
        showBreadcrumb: true,
        relaunchSkip: true,
      },
    },
    {
      name: "analytics",
      label: "onboarding.breadcrumb.analytics",
      options: {
        showBreadcrumb: true,
        relaunchSkip: true,
      },
    },
    {
      name: "finish",
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
  ],
};

const handlers = {
  ONBOARDING_NEXT_STEP: state => {
    const step = state.steps.find(step => step.name === state.stepName);
    if (!step) {
      return state;
    }
    const index = state.steps.indexOf(step);
    if (index > state.steps.length - 2) {
      return state;
    }
    return { ...state, stepName: state.steps[index + 1].name, stepIndex: index + 1 };
  },
  ONBOARDING_PREV_STEP: (state: OnboardingState) => {
    const step = state.steps.find(step => step.name === state.stepName);
    if (!step) {
      return state;
    }
    const index = state.steps.indexOf(step);
    if (index < 1) {
      return state;
    }
    return { ...state, stepName: state.steps[index - 1].name, stepIndex: index - 1 };
  },
  ONBOARDING_JUMP_STEP: (state: OnboardingState, { payload: stepName }) => {
    const step = state.steps.find(step => step.name === stepName);
    if (!step) {
      return state;
    }
    const index = state.steps.indexOf(step);
    return { ...state, stepName: step.name, stepIndex: index };
  },

  UPDATE_GENUINE_CHECK: (state: OnboardingState, { payload: obj }) => ({
    ...state,
    genuine: {
      ...state.genuine,
      ...obj,
    },
  }),
  ONBOARDING_SET_FLOW_TYPE: (state: OnboardingState, { payload: flowType }) => ({
    ...state,
    flowType,
  }),
  ONBOARDING_SET_DEVICE_TYPE: (state: OnboardingState, { payload: deviceModelId }) => ({
    ...state,
    deviceModelId,
  }),
  ONBOARDING_RELAUNCH: (state: OnboardingState, { payload: onboardingRelaunched }) => ({
    ...initialState,
    onboardingRelaunched,
  }),
};

export default handleActions(handlers, initialState);

export const onboardingSelector = (s: State): OnboardingState => s.onboarding;

export const onboardingRelaunchedSelector = (s: State): ?boolean =>
  s.onboarding.onboardingRelaunched;
