// @flow

import { handleActions } from "redux-actions";

import type { AppManifest } from "@ledgerhq/live-common/lib/platform/types";

import type { State } from "~/renderer/reducers";

export type PlatformAppDrawerInfo = {
  type: "DAPP_INFO",
  manifest: ?AppManifest,
  title: string,
};

export type PlatformAppDrawerDisclaimer = {
  type: "DAPP_DISCLAIMER",
  manifest: ?AppManifest,
  disclaimerId: string,
  title: string,
  next: () => void,
};

export type PlatformAppDrawers = PlatformAppDrawerInfo & PlatformAppDrawerDisclaimer;

export type UIState = {
  informationCenter: {
    isOpen: boolean,
    tabId: string,
  },
  platformAppDrawer: {
    isOpen: boolean,
    payload: ?PlatformAppDrawers,
  },
};

const initialState: UIState = {
  informationCenter: {
    isOpen: false,
    tabId: "announcement",
  },
  platformAppDrawer: {
    isOpen: false,
    payload: undefined,
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

  PLATFORM_APP_DRAWER_OPEN: (state, { payload }: { payload: PlatformAppDrawers }) => {
    return {
      ...state,
      platformAppDrawer: {
        isOpen: true,
        payload,
      },
    };
  },

  PLATFORM_APP_DRAWER_CLOSE: state => {
    return {
      ...state,
      platformAppDrawer: {
        ...state.platformAppDrawer,
        isOpen: false,
      },
    };
  },
};

// Selectors

export const UIStateSelector = (state: State): UIState => state.UI;

export const informationCenterStateSelector = (state: Object) => state.UI.informationCenter;

export const platformAppDrawerStateSelector = (state: Object) => state.UI.platformAppDrawer;
// Exporting reducer

export default handleActions(handlers, initialState);
