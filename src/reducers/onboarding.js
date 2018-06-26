// @flow

import { SKIP_ONBOARDING } from 'config/constants'
import { handleActions, createAction } from 'redux-actions'

type Step = {
  name: string,
  external?: boolean,
  label?: string,
  options: {
    showFooter: boolean,
    showBackground: boolean,
    showBreadcrumb: boolean,
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
  isLedgerNano: boolean | null,
  flowType: string,
}

const state: OnboardingState = {
  stepIndex: 0, // FIXME is this used at all? dup with stepName?
  stepName: SKIP_ONBOARDING ? 'finish' : 'start',
  genuine: {
    pinStepPass: false,
    recoveryStepPass: false,
    isGenuineFail: false,
    isDeviceGenuine: false,
    genuineCheckUnavailable: null,
    displayErrorScreen: false,
  },
  isLedgerNano: null,
  flowType: '',
  steps: [
    {
      name: 'start',
      external: true,
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: false,
      },
    },
    {
      name: 'init',
      external: true,
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: false,
      },
    },
    {
      name: 'noDevice',
      external: true,
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: false,
      },
    },
    {
      name: 'selectDevice',
      label: 'onboarding:breadcrumb.selectDevice',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'selectPIN',
      label: 'onboarding:breadcrumb.selectPIN',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'writeSeed',
      label: 'onboarding:breadcrumb.writeSeed',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'genuineCheck',
      label: 'onboarding:breadcrumb.genuineCheck',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'setPassword',
      label: 'onboarding:breadcrumb.setPassword',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'analytics',
      label: 'onboarding:breadcrumb.analytics',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'finish',
      external: true,
      options: {
        showFooter: false,
        showBackground: true,
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
  ONBOARDING_PREV_STEP: state => {
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
  ONBOARDING_JUMP_STEP: (state, { payload: stepName }) => {
    const step = state.steps.find(step => step.name === stepName)
    if (!step) {
      return state
    }
    const index = state.steps.indexOf(step)
    return { ...state, stepName: step.name, stepIndex: index }
  },

  UPDATE_GENUINE_CHECK: (state, { payload: obj }) => ({
    ...state,
    genuine: {
      ...state.genuine,
      ...obj,
    },
  }),
  ONBOARDING_SET_FLOW_TYPE: (state, { payload: flowType }) => ({
    ...state,
    flowType,
  }),
  ONBOARDING_SET_DEVICE_TYPE: (state, { payload: isLedgerNano }) => ({
    ...state,
    isLedgerNano,
  }),
}

export default handleActions(handlers, state)

export const nextStep = createAction('ONBOARDING_NEXT_STEP')
export const prevStep = createAction('ONBOARDING_PREV_STEP')
export const jumpStep = createAction('ONBOARDING_JUMP_STEP')
export const updateGenuineCheck = createAction('UPDATE_GENUINE_CHECK')
export const isLedgerNano = createAction('ONBOARDING_SET_DEVICE_TYPE')
export const flowType = createAction('ONBOARDING_SET_FLOW_TYPE')
