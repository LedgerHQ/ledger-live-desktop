// @flow
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { openModal } from "~/renderer/actions/modals";
import { getSystemLocale } from "~/helpers/systemLocale";
import { osLangAndRegionSelector } from "~/renderer/reducers/application";

const IsSystemLanguageAvailable = () => {
  const dispatch = useDispatch();
  const { language: currLang } = useSelector(osLangAndRegionSelector);
  const { language: systemLang } = getSystemLocale();

  useEffect(() => {
    console.log("IsSystemLanguageAvailable", currLang, systemLang);
    // if (currLang !== systemLang) { // TODO: replace after tests
    if (currLang === systemLang) {
      dispatch(openModal("MODAL_SYSTEM_LANGUAGE_AVAILABLE", systemLang));
    }
  }, [systemLang, dispatch, currLang]);

  return null;
};

export default IsSystemLanguageAvailable;
