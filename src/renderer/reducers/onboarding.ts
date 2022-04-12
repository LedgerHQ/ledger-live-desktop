import { DeviceModelId } from "@ledgerhq/devices";
import { handleActions } from "redux-actions";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { State } from ".";

type Step = {
  name: string;
  external?: boolean;
  label?: string;
  options: {
    showBreadcrumb: boolean;
    relaunchSkip?: boolean;
    alreadyInitSkip?: boolean;
  };
};

export enum UseCase {
  setupDevice = "setup-device",
  connectDevice = "connect-device",
  recoveryPhrase = "recovery-phrase",
}

export type OnboardingState = {
  stepIndex: number;
  stepName: string; // TODO: specify that the string comes from Steps type
  deviceModelId?: DeviceModelId;
  steps: Step[];
  genuine: {
    isDeviceGenuine: boolean;
    displayErrorScreen: boolean;
  };
  onboardingRelaunched?: boolean;
  useCase?: UseCase;
};

// type TutorialState;

const initialState: OnboardingState = {
  stepIndex: 0,
  stepName: getEnv("SKIP_ONBOARDING") ? "analytics" : "start",
  deviceModelId: undefined,
  genuine: {
    isDeviceGenuine: false,
    displayErrorScreen: false,
  },
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
  useCase: undefined,
};

const handlers = {
  UPDATE_GENUINE_CHECK: (state: OnboardingState, { payload: obj }) => ({
    ...state,
    genuine: {
      ...state.genuine,
      ...obj,
    },
  }),
  ONBOARDING_SET_DEVICE_MODEL_ID: (state: OnboardingState, { payload: deviceModelId }) => ({
    ...state,
    deviceModelId,
  }),
  ONBOARDING_RELAUNCH: (state: OnboardingState, { payload: onboardingRelaunched }) => {
    return {
      ...initialState,
      onboardingRelaunched,
    };
  },
  SET_USE_CASE: (state: OnboardingState, { payload: useCase }) => {
    return {
      ...state,
      useCase,
    };
  },
};

export default handleActions(handlers, initialState);

export const onboardingSelector = (s: State): OnboardingState => s.onboarding;

export const onboardingRelaunchedSelector = (s: State): boolean =>
  s.onboarding.onboardingRelaunched;

export const deviceModelIdSelector = (s: State): DeviceModelId => s.onboarding.deviceModelId;
