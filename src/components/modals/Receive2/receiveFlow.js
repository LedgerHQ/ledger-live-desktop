import { Machine, assign } from 'xstate'

import SelectAccountStep from './steps/1-select-account'
import PrepareDeviceStep from './steps/2-prepare-device'
import VerifyDeviceStep from './steps/3-verify-device'

// states
const SELECT_ACCOUNT = "selectAccount"
const PREPARE_DEVICE = "prepareDevice"
const VERIFY_DEVICE = "verifyDevice"
const COMPLETE = "complete"

// actions
export const ACCOUNT_SELECTED = "accountSelected"
export const DEVICE_READY = "deviceReady"
export const ACTION_VERIFIED = "actionVerified"

export const components = {
  [SELECT_ACCOUNT]: SelectAccountStep,
  [PREPARE_DEVICE]: PrepareDeviceStep,
  [VERIFY_DEVICE]: VerifyDeviceStep,
  [COMPLETE]: null,
}

export const machine = Machine({
  id: 'receiveFlow',
  initial: SELECT_ACCOUNT,
  context: {
    account: null,
  },
  states: {
    [SELECT_ACCOUNT]: {
      meta: {
        index: 1
      },
      on: {
        [ACCOUNT_SELECTED]: {
          target: PREPARE_DEVICE,
          actions: assign((context, event) => ({
            account: event.account
          }))
        }
      }
    },
    [PREPARE_DEVICE]: {
      meta: {
        index: 2
      },
      on: {
        [DEVICE_READY]: VERIFY_DEVICE,
      }
    },
    [VERIFY_DEVICE]: {
      meta: {
        index: 3
      },
      on: {
        [ACTION_VERIFIED]: COMPLETE,
      }
    },
    [COMPLETE]: {
      meta: {
        index: 4
      },
      type: 'final'
    },
  }
});

