// @flow
import memoize from "lodash/memoize";

const parse = memoize(navLang => {
  const localeSplit = (navLang || "").split("-");
  const language = (localeSplit[0] || "").toLowerCase() || null;
  const region = (localeSplit[1] || "").toUpperCase() || null;
  return { language, region };
});

export const getSystemLocale = () => parse(window.navigator.language);
