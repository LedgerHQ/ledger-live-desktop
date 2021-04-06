// @flow

import { handleActions } from "redux-actions";
import type { State } from "~/renderer/reducers";

export type UIState = {
  informationCenter: {
    isOpen: boolean,
    tabId: string,
  },
};

const initialState: UIState = {
  informationCenter: {
    isOpen: false,
    tabId: "announcement",
  },
};

type OpenPayload = {
  tabId?: string,
};

const handlers = {
  INFORMATION_CENTER_OPEN: (state, { payload }: { payload: OpenPayload }) => {
    const { tabId } = payload;

    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        isOpen: true,
        tabId: tabId || "announcement",
      },
    };
  },
  INFORMATION_CENTER_SET_TAB: (state, { payload }: { payload: OpenPayload }) => {
    const { tabId } = payload;

    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        tabId: tabId,
      },
    };
  },
  INFORMATION_CENTER_CLOSE: state => {
    return {
      ...state,
      informationCenter: {
        ...state.informationCenter,
        isOpen: false,
      },
    };
  },
};

// Selectors

export const UIStateSelector = (state: State): UIState => state.UI;

export const informationCenterStateSelector = (state: Object) => state.UI.informationCenter;
// Exporting reducer

export default handleActions(handlers, initialState);
