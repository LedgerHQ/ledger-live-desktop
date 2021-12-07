// @flow

import { handleActions } from "redux-actions";
import type { State } from "~/renderer/reducers";

export type ModalsState = {
  [key: string]: {
    isOpened: boolean,
    data?: Object,
  },
};

const state: ModalsState = {};

type OpenPayload = {
  name: string,
  data?: Object,
};

type ClosePayload = {
  name: string,
};

const handlers = {
  MODAL_OPEN: (state, { payload }: { payload: OpenPayload }) => {
    const { name, data } = payload;
    return {
      ...state,
      [name]: {
        isOpened: true,
        data,
      },
    };
  },
  MODAL_CLOSE: (state, { payload }: { payload: ClosePayload }) => {
    const { name } = payload;
    return {
      ...state,
      [name]: {
        isOpened: false,
      },
    };
  },
  MODAL_CLOSE_ALL: () => {
    return {};
  },
  MODAL_SET_DATA: (state, { payload }: { payload: OpenPayload }) => {
    const { name, data } = payload;
    return {
      ...state,
      [name]: {
        ...state[name],
        data,
      },
    };
  },
};

// Selectors

export const modalsStateSelector = (state: State): ModalsState => state.modals;

export const isModalOpened = (state: Object, name: string) =>
  state.modals[name] && state.modals[name].isOpened;

export const getModalData = (state: Object, name: string) =>
  state.modals[name] && state.modals[name].data;

// Exporting reducer

export default handleActions(handlers, state);
