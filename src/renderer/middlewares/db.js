// @flow

/* eslint-disable consistent-return */

import { setKey } from "~/renderer/storage";

import { accountsSelector } from "./../reducers/accounts";
import { settingsExportSelector, areSettingsLoaded } from "./../reducers/settings";

let DB_MIDDLEWARE_ENABLED = true;

// ability to temporary disable the db middleware from outside
export const disable = (ms: number = 1000) => {
  DB_MIDDLEWARE_ENABLED = false;
  setTimeout(() => (DB_MIDDLEWARE_ENABLED = true), ms);
};

export default (store: any) => (next: any) => (action: any) => {
  if (DB_MIDDLEWARE_ENABLED && action.type.startsWith("DB:")) {
    const [, type] = action.type.split(":");
    store.dispatch({ type, payload: action.payload });
    const state = store.getState();
    setKey("app", "accounts", accountsSelector(state));
    // ^ TODO ultimately we'll do same for accounts to drop DB: pattern
  } else {
    const oldState = store.getState();
    const res = next(action);
    const newState = store.getState();
    // NB Prevent write attempts when the app is locked.
    if (!oldState.application.isLocked || action.type === "APPLICATION_SET_DATA") {
      if (areSettingsLoaded(newState) && oldState.settings !== newState.settings) {
        setKey("app", "settings", settingsExportSelector(newState));
      }
    }
    return res;
  }
};
