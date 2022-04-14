import { DeviceModelId } from "@ledgerhq/devices";
import { handleActions } from "redux-actions";
import { State } from ".";

export enum UseCase {
  setupDevice = "setup-device",
  connectDevice = "connect-device",
  recoveryPhrase = "recovery-phrase",
}

export type OnboardingState = {
  genuine: {
    isDeviceGenuine: boolean;
    displayErrorScreen: boolean;
  };
};

const initialState: OnboardingState = {
  genuine: {
    isDeviceGenuine: false,
    displayErrorScreen: false,
  },
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
};

export default handleActions(handlers, initialState);

export const onboardingSelector = (s: State): OnboardingState => s.onboarding;
