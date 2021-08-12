// @flow
import { createAction } from "redux-actions";

export const openInformationCenter = createAction("INFORMATION_CENTER_OPEN", tabId => ({ tabId }));
export const setTabInformationCenter = createAction("INFORMATION_CENTER_SET_TAB", tabId => ({
  tabId,
}));
export const closeInformationCenter = createAction("INFORMATION_CENTER_CLOSE");

export const openPlatformAppInfoDrawer = createAction(
  "PLATFORM_APP_DRAWER_OPEN",
  ({ manifest }) => ({
    type: "DAPP_INFO",
    title: "platform.app.informations.title",
    manifest,
  }),
);
export const openPlatformAppDisclaimerDrawer = createAction(
  "PLATFORM_APP_DRAWER_OPEN",
  ({ manifest, disclaimerId, next }) => ({
    type: "DAPP_DISCLAIMER",
    manifest,
    title: null,
    disclaimerId,
    next,
  }),
);
export const closePlatformAppDrawer = createAction("PLATFORM_APP_DRAWER_CLOSE");
