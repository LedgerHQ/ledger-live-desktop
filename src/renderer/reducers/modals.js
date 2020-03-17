// @flow

import { handleActions } from "redux-actions";
import type { State } from "~/renderer/reducers";
import { registeredModalNames } from "~/renderer/modals";
import invariant from "invariant";

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
    invariant(registeredModalNames.includes(name), `Attempt to open unregistered modal '${name}'`);
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
    invariant(registeredModalNames.includes(name), `Attempt to close unregistered modal '${name}'`);
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
    invariant(
      registeredModalNames.includes(name),
      `Attempt to update unregistered modal '${name}'`,
    );
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
