import { handleActions } from "redux-actions";
import { getSystemLocale } from "~/helpers/systemLocale";
import { getLanguages } from "~/config/languages";
import { LangAndRegion } from "~/renderer/reducers/settings";

export type ApplicationState = {
  isLocked?: boolean;
  hasPassword?: boolean;
  dismissedCarousel?: boolean;
  osDarkMode?: boolean;
  osLanguage?: LangAndRegion;
  navigationLocked?: boolean;
  debug: {
    alwaysShowSkeletons: boolean;
  };
  onboardingRelaunched: boolean;
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
  debug: {
    alwaysShowSkeletons: false,
  },
  onboardingRelaunched: false,
};

const handlers = {
  APPLICATION_SET_DATA: (state: ApplicationState, { payload }: { payload: ApplicationState }) => ({
    ...state,
    ...payload,
  }),
  RELAUNCH_ONBOARDING: (
    state: ApplicationState,
    { payload: onboardingRelaunched }: { payload: boolean },
  ) => {
    return {
      ...state,
      onboardingRelaunched,
    };
  },
};

// NOTE: V2 `lock` and `unlock` have been moved to actions/application.js

// Selectors

export const isLocked = (state: ApplicationState) => state.application.isLocked === true;

export const hasPasswordSelector = (state: ApplicationState) =>
  state.application.hasPassword === true;

export const hasDismissedCarouselSelector = (state: ApplicationState) =>
  state.application.dismissedCarousel === true;

export const osDarkModeSelector = (state: ApplicationState) => state.application.osDarkMode;

export const alwaysShowSkeletonsSelector = (state: ApplicationState) =>
  state.application.debug.alwaysShowSkeletons;

export const osLangAndRegionSelector = (state: ApplicationState) => state.application.osLanguage;

export const onboardingRelaunchedSelector = (state: ApplicationState) =>
  state.application.onboardingRelaunched as boolean;

export const isNavigationLocked = (state: ApplicationState) => state.application.navigationLocked;

// Exporting reducer

export default handleActions(handlers, state);
