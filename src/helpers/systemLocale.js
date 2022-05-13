// @flow
import memoize from "lodash/memoize";

const parse = memoize(navLang => {
  const localeSplit = (navLang || "").split("-");
  const language = (localeSplit[0] || "").toLowerCase() || null;
  const region = (localeSplit[1] || "").toUpperCase() || null;
  return { language, region };
});

/**
 * This param "appLocale" that we are using is set in the main thread,
 * in the main/window-lifecycle.js function loadWindow()
 * We don't use window.navigator.language directly as it doesn't always actually
 * follow the system language, it's unreliable. cf. https://stackoverflow.com/a/3335420
 * */
export const getSystemLocale = () => {
  return new URLSearchParams(window.location.search).get("appLocale") || window.navigator.language;
};

export const getParsedSystemLocale = () => parse(getSystemLocale());
