import { Machine, assign } from 'xstate'

// States
export const SELECT_ACCOUNT = 'select_account'
export const PREPARE_DEVICE = 'prepare_device'
export const INFORM_USER = 'inform_user'
export const VERIFY_DEVICE = 'verify_device'

// Events
export const ACCOUNT_SELECTED = 'account_selected'
export const DEVICE_READY = 'device_ready'
export const DEVICE_VERIFIED = 'device_verified'
export const DEVICE_DECLINED = 'device_declined'
export const NEXT = 'next'
export const PREV = 'prev'
export const AGAIN = 'again'
export const SKIP = 'skip'

export const machine = Machine(
  {
    id: 'receiveFlow',
    initial: SELECT_ACCOUNT,
    context: {
      account: null,
      parentAccount: null,
      deviceReady: false,
      deviceVerified: null,
      verifyAddressError: null,
      deviceSkipped: false,
    },
    states: {
      [SELECT_ACCOUNT]: {
        on: {
          [ACCOUNT_SELECTED]: {
            actions: 'setAccount',
          },
          [NEXT]: {
            target: PREPARE_DEVICE,
            cond: 'accountNotNull',
          },
        },
      },

      [PREPARE_DEVICE]: {
        entry: assign({
          deviceReady: false,
          deviceVerified: null,
          verifyAddressError: null,
          deviceSkipped: false,
        }),
        on: {
          [PREV]: SELECT_ACCOUNT,
          [DEVICE_READY]: {
            actions: assign({
              deviceReady: true,
            }),
          },
          [NEXT]: {
            target: INFORM_USER,
            cond: 'deviceConnected',
          },
          [SKIP]: {
            target: VERIFY_DEVICE,
            actions: assign({
              deviceVerified: false,
              deviceSkipped: true,
            }),
          },
        },
      },

      [INFORM_USER]: {
        on: {
          [PREV]: PREPARE_DEVICE,
          [NEXT]: {
            target: VERIFY_DEVICE,
            actions: assign({
              deviceVerified: null,
            }),
          },
        },
      },

      [VERIFY_DEVICE]: {
        on: {
          [DEVICE_VERIFIED]: {
            actions: assign({
              deviceVerified: true,
            }),
          },
          [DEVICE_DECLINED]: {
            target: INFORM_USER,
            actions: assign((context, event) => ({
              verifyAddressError: event.error,
              deviceVerified: false,
            })),
          },
          [AGAIN]: PREPARE_DEVICE,
        },
      },
    },
  },
  {
    guards: {
      accountNotNull: context => !!context.account,
      deviceConnected: context => context.deviceReady,
    },
    actions: {
      setAccount: assign((context, event) => ({
        account: event.account,
        parentAccount: event.parentAccount,
      })),
    },
  },
)
