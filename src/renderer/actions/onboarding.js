// @flow
import { createAction } from "redux-actions";

export const relaunchOnboarding = createAction("ONBOARDING_RELAUNCH");
export const nextStep = createAction("ONBOARDING_NEXT_STEP");
export const prevStep = createAction("ONBOARDING_PREV_STEP");
export const jumpStep = createAction("ONBOARDING_JUMP_STEP");
export const updateGenuineCheck = createAction("UPDATE_GENUINE_CHECK");
export const deviceModelId = createAction("ONBOARDING_SET_DEVICE_TYPE");
export const flowType = createAction("ONBOARDING_SET_FLOW_TYPE");
