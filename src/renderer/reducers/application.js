// @flow

import { handleActions } from "redux-actions";
import { getSystemLocale } from "~/helpers/systemLocale";
import { getLanguages } from "~/config/languages";
import type { LangAndRegion } from "~/renderer/reducers/settings";

export type ApplicationState = {
  isLocked?: boolean,
  hasPassword?: boolean,
  osDarkMode?: boolean,
  osLanguage?: LangAndRegion,
  navigationLocked?: boolean,
};

const { language, region } = getSystemLocale();
const languages = getLanguages();
const osLangSupported = languages.includes(language);

const state: ApplicationState = {
  osDarkMode: window.matchMedia("(prefers-color-scheme: dark)").matches,
  osLanguage: {
    language: osLangSupported ? language : "en",
    region: osLangSupported ? region : "US",
    useSystem: true,
  },
  hasPassword: false,
};

const handlers = {
  APPLICATION_SET_DATA: (state, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
};

// NOTE: V2 `lock` and `unlock` have been moved to actions/application.js

// Selectors

export const isLocked = (state: Object) => state.application.isLocked === true;

export const hasPasswordSelector = (state: Object) => state.application.hasPassword === true;

export const osDarkModeSelector = (state: Object) => state.application.osDarkMode;

export const osLangAndRegionSelector = (state: Object) => state.application.osLanguage;

export const isNavigationLocked = (state: Object) => state.application.navigationLocked;

// Exporting reducer

export default handleActions(handlers, state);
