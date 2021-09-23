// @flow
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openModal } from "~/renderer/actions/modals";
import { getSystemLocale } from "~/helpers/systemLocale";
import { osLangAndRegionSelector } from "~/renderer/reducers/application";

const lastAskedLanguageAvailable = "2021-09-23";

export function hasAnsweredLanguageAvailable() {
  return global.localStorage.getItem("hasAnsweredLanguageAvailable") === lastAskedLanguageAvailable;
}

export function answerLanguageAvailable() {
  return global.localStorage.setItem("hasAnsweredLanguageAvailable", lastAskedLanguageAvailable);
}

const IsSystemLanguageAvailable = () => {
  const dispatch = useDispatch();
  const { language: currAppLanguage } = useSelector(osLangAndRegionSelector);
  const { language: osLanguage } = getSystemLocale();

  useEffect(() => {
    console.log("IsSystemLanguageAvailable", currAppLanguage, osLanguage);
    // if (currLang !== systemLang && !hasAnsweredLanguageAvailable()) { // TODO: replace after tests
    if (currAppLanguage === osLanguage && !hasAnsweredLanguageAvailable()) {
      dispatch(openModal("MODAL_SYSTEM_LANGUAGE_AVAILABLE", { osLanguage, currAppLanguage }));
    }
  }, [osLanguage, dispatch, currAppLanguage]);

  return null;
};

export default IsSystemLanguageAvailable;
