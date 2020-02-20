// @flow

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import locales from ".";

const config = {
  resources: locales,
  lng: "en",
  defaultNS: "app",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  debug: __DEV__,
  react: {
    useSuspense: false,
  },
};

i18n.use(initReactI18next).init(config);

if (module.hot) {
  module.hot.accept("./index", () => {
    const newResources = require("./index").default;
    Object.keys(newResources).forEach(lang => {
      const langObj = newResources[lang];

      Object.keys(langObj).forEach(namespace => {
        const nsResource = langObj[namespace];
        i18n.addResourceBundle(lang, namespace, nsResource, true, true);
      });
    });
  });
}

export default i18n;
