// @flow
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";
import { urls } from "~/config/urls";

const currentTermsRequired = "2019-12-04";
const currentLendingTermsRequired = "2020-11-10";

export function isAcceptedTerms() {
  return global.localStorage.getItem("acceptedTermsVersion") === currentTermsRequired;
}

export function isAcceptedLendingTerms() {
  return global.localStorage.getItem("acceptedLendingTermsVersion") === currentLendingTermsRequired;
}

export function acceptTerms() {
  return global.localStorage.setItem("acceptedTermsVersion", currentTermsRequired);
}

export function acceptLendingTerms() {
  return global.localStorage.setItem("acceptedLendingTermsVersion", currentLendingTermsRequired);
}

export const usePrivacyUrl = () => {
  const [privacyUrl, setPrivacyUrl] = useState(urls.privacyPolicy.en);

  const language = useSelector(languageSelector);
  useEffect(() => {
    setPrivacyUrl(urls.privacyPolicy[language] || urls.privacyPolicy.en);
  }, [language]);

  return privacyUrl;
};

// TODO: Merge useTermsUrl and usePrivacyUrl to create generic useDynamicUrl
export const useTermsUrl = () => {
  const fallbackMessage = urls.terms.en;
  const [termsUrl, setTermsUrl] = useState(fallbackMessage);

  const language = useSelector(languageSelector);
  useEffect(() => {
    setTermsUrl(urls.terms[language] || fallbackMessage);
  }, [language]);

  return termsUrl;
};
