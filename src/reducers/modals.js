// @flow

import { handleActions, createAction } from 'redux-actions'

export type ModalsState = {
  [key: string]: {
    isOpened: boolean,
    data?: Object,
  },
}

const state: ModalsState = {}

type OpenPayload = {
  name: string,
  data?: Object,
}

type ClosePayload = {
  name: string,
}

const handlers = {
  MODAL_OPEN: (state, { payload }: { payload: OpenPayload }) => {
    const { name, data } = payload
    return {
      // Close all modal before
      ...Object.keys(state).reduce((result, key) => {
        result[key] = {
          isOpened: false,
          data: undefined,
        }
        return result
      }, {}),
      [name]: {
        isOpened: true,
        data,
      },
    }
  },
  MODAL_CLOSE: (state, { payload }: { payload: ClosePayload }) => {
    const { name } = payload
    return {
      ...state,
      [name]: {
        isOpened: false,
      },
    }
  },
  MODAL_SET_DATA: (state, { payload }: { payload: OpenPayload }) => {
    const { name, data } = payload
    return {
      ...state,
      [name]: {
        ...state[name],
        data,
      },
    }
  },
}

// Actions

export const openModal = createAction('MODAL_OPEN', (name, data) => ({ name, data }))
export const closeModal = createAction('MODAL_CLOSE', name => ({ name }))
export const setDataModal = createAction('MODAL_SET_DATA', (name, data) => ({ name, data }))

// Selectors

export const isModalOpened = (state: Object, name: string) =>
  state.modals[name] && state.modals[name].isOpened

export const getModalData = (state: Object, name: string) =>
  state.modals[name] && state.modals[name].data

// Exporting reducer

export default handleActions(handlers, state)
