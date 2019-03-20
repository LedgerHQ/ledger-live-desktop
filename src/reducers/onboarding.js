// @flow

import type { DeviceModelId } from '@ledgerhq/devices'
import { SKIP_ONBOARDING } from 'config/constants'
import { handleActions, createAction } from 'redux-actions'
import type { State } from '.'

type Step = {
  name: string,
  external?: boolean,
  label?: string,
  options: {
    showBreadcrumb: boolean,
    relaunchSkip?: boolean,
    alreadyInitSkip?: boolean,
  },
}

export type OnboardingState = {
  stepIndex: number,
  stepName: string, // TODO: specify that the string comes from Steps type
  steps: Step[],
  genuine: {
    pinStepPass: boolean,
    recoveryStepPass: boolean,
    isGenuineFail: boolean,
    isDeviceGenuine: boolean,
    genuineCheckUnavailable: ?Error,
    displayErrorScreen: boolean,
  },
  deviceModelId: ?DeviceModelId,
  flowType: string,
  onboardingRelaunched?: boolean,
}

const initialState: OnboardingState = {
  stepIndex: 0,
  stepName: SKIP_ONBOARDING ? 'analytics' : 'start',
  genuine: {
    pinStepPass: false,
    recoveryStepPass: false,
    isGenuineFail: false,
    isDeviceGenuine: false,
    genuineCheckUnavailable: null,
    displayErrorScreen: false,
  },
  deviceModelId: null,
  flowType: '',
  onboardingRelaunched: false,
  steps: [
    {
      name: 'start',
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: 'init',
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: 'noDevice',
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
    {
      name: 'selectDevice',
      label: 'onboarding.breadcrumb.selectDevice',
      options: {
        showBreadcrumb: true,
      },
    },
    {
      name: 'selectPIN',
      label: 'onboarding.breadcrumb.selectPIN',
      options: {
        showBreadcrumb: true,
        alreadyInitSkip: true,
      },
    },
    {
      name: 'writeSeed',
      label: 'onboarding.breadcrumb.writeSeed',
      options: {
        showBreadcrumb: true,
        alreadyInitSkip: true,
      },
    },
    {
      name: 'genuineCheck',
      label: 'onboarding.genuineCheck.title',
      options: {
        showBreadcrumb: true,
      },
    },
    {
      name: 'setPassword',
      label: 'onboarding.breadcrumb.setPassword',
      options: {
        showBreadcrumb: true,
        relaunchSkip: true,
      },
    },
    {
      name: 'analytics',
      label: 'onboarding.breadcrumb.analytics',
      options: {
        showBreadcrumb: true,
        relaunchSkip: true,
      },
    },
    {
      name: 'finish',
      external: true,
      options: {
        showBreadcrumb: false,
      },
    },
  ],
}

const handlers = {
  ONBOARDING_NEXT_STEP: state => {
    const step = state.steps.find(step => step.name === state.stepName)
    if (!step) {
      return state
    }
    const index = state.steps.indexOf(step)
    if (index > state.steps.length - 2) {
      return state
    }
    return { ...state, stepName: state.steps[index + 1].name, stepIndex: index + 1 }
  },
  ONBOARDING_PREV_STEP: (state: OnboardingState) => {
    const step = state.steps.find(step => step.name === state.stepName)
    if (!step) {
      return state
    }
    const index = state.steps.indexOf(step)
    if (index < 1) {
      return state
    }
    return { ...state, stepName: state.steps[index - 1].name, stepIndex: index - 1 }
  },
  ONBOARDING_JUMP_STEP: (state: OnboardingState, { payload: stepName }) => {
    const step = state.steps.find(step => step.name === stepName)
    if (!step) {
      return state
    }
    const index = state.steps.indexOf(step)
    return { ...state, stepName: step.name, stepIndex: index }
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
}

export default handleActions(handlers, initialState)

export const onboardingRelaunchedSelector = (s: State): ?boolean =>
  s.onboarding.onboardingRelaunched

export const relaunchOnboarding = createAction('ONBOARDING_RELAUNCH')
export const nextStep = createAction('ONBOARDING_NEXT_STEP')
export const prevStep = createAction('ONBOARDING_PREV_STEP')
export const jumpStep = createAction('ONBOARDING_JUMP_STEP')
export const updateGenuineCheck = createAction('UPDATE_GENUINE_CHECK')
export const deviceModelId = createAction('ONBOARDING_SET_DEVICE_TYPE')
export const flowType = createAction('ONBOARDING_SET_FLOW_TYPE')
