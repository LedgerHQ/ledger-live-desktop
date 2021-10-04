// @flow
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openModal } from "~/renderer/actions/modals";
import { getSystemLocale } from "~/helpers/systemLocale";
import { languageSelector, pushedLanguages } from "~/renderer/reducers/settings";

// To reset os language proposition, change this date !
const lastAskedLanguageAvailable = "2021-09-23";

export function hasAnsweredLanguageAvailable() {
  return global.localStorage.getItem("hasAnsweredLanguageAvailable") === lastAskedLanguageAvailable;
}

export function answerLanguageAvailable() {
  return global.localStorage.setItem("hasAnsweredLanguageAvailable", lastAskedLanguageAvailable);
}

const IsSystemLanguageAvailable = () => {
  const dispatch = useDispatch();
  const currAppLanguage = useSelector(languageSelector);
  const { language: osLanguage } = getSystemLocale();

  useEffect(() => {
    if (
      !hasAnsweredLanguageAvailable() &&
      currAppLanguage !== osLanguage &&
      pushedLanguages.includes(osLanguage)
    ) {
      dispatch(openModal("MODAL_SYSTEM_LANGUAGE_AVAILABLE", { osLanguage, currAppLanguage }));
    }
  }, [osLanguage, dispatch, currAppLanguage]);

  return null;
};

export default IsSystemLanguageAvailable;
