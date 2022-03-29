// @flow

import { handleActions } from "redux-actions";
import { getSystemLocale } from "~/helpers/systemLocale";
import { getLanguages } from "~/config/languages";
import type { LangAndRegion } from "~/renderer/reducers/settings";

export type ApplicationState = {
  isLocked?: boolean,
  hasPassword?: boolean,
  dismissedCarousel?: boolean,
  osDarkMode?: boolean,
  osLanguage?: LangAndRegion,
  navigationLocked?: boolean,
  notSeededDeviceRelaunch?: boolean,
  debug: {
    alwaysShowSkeletons: boolean,
  },
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
  dismissedCarousel: false,
  notSeededDeviceRelaunch: false,
  debug: {
    alwaysShowSkeletons: false,
  },
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

export const hasDismissedCarouselSelector = (state: Object) =>
  state.application.dismissedCarousel === true;

export const osDarkModeSelector = (state: Object) => state.application.osDarkMode;

export const alwaysShowSkeletonsSelector = (state: Object) =>
  state.application.debug.alwaysShowSkeletons;

export const osLangAndRegionSelector = (state: Object) => state.application.osLanguage;

export const notSeededDeviceRelaunchSelector = (state: Object) =>
  state.application.notSeededDeviceRelaunch;

export const isNavigationLocked = (state: Object) => state.application.navigationLocked;

// Exporting reducer

export default handleActions(handlers, state);
