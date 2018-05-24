// @flow

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
  isGenuineFail: boolean,
}

const state: OnboardingState = {
  stepIndex: 0,
  stepName: 'start',
  isGenuineFail: false,
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
      name: 'selectDevice',
      label: 'Select Device',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'selectPIN',
      label: 'Select PIN',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'writeSeed',
      label: 'Write Seed',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'genuineCheck',
      label: 'Genuine Check',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'setPassword',
      label: 'Set Password',
      options: {
        showFooter: false,
        showBackground: true,
        showBreadcrumb: true,
      },
    },
    {
      name: 'analytics',
      label: 'Analytics & Bug report',
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
  ONBOARDING_SET_GENUINE_CHECK_FAIL: (state, { payload: isGenuineFail }) => ({
    ...state,
    isGenuineFail,
  }),
}

export default handleActions(handlers, state)

export const nextStep = createAction('ONBOARDING_NEXT_STEP')
export const prevStep = createAction('ONBOARDING_PREV_STEP')
export const jumpStep = createAction('ONBOARDING_JUMP_STEP')
export const setGenuineCheckFail = createAction('ONBOARDING_SET_GENUINE_CHECK_FAIL')
