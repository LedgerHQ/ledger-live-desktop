import { Machine } from 'xstate'
// Available variables:
// - Machine
// - interpret
// - assign
// - send
// - sendParent
// - spawn
// - raise
// - actions
// - XState (all XState exports)

// states
const SELECT_ACCOUNT = "@receiveFlow/selectAccount"
const PREPARE_DEVICE = "@receiveFlow/prepareDevice"
const VERIFY_DEVICE = "@receiveFlow/verifyDevice"
const COMPLETE = "@receiveFlow/complete"

export const receiveFlow = Machine({
  id: 'receiveFlow',
  initial: SELECT_ACCOUNT,
  context: {

  },
  states: {
    [SELECT_ACCOUNT]: {
      on: {
        ACCOUNT_SELECTED: PREPARE_DEVICE
      }
    },
    [PREPARE_DEVICE]: {
      on: {
        DEVICE_READY: VERIFY_DEVICE,
      }
    },
    [VERIFY_DEVICE]: {
      on: {
        ACTION_VERIFIED: COMPLETE,
      }
    },
    [COMPLETE]: {
      type: 'final'
    },
  }
});

