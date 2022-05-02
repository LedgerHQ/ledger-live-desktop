// @flow
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";
import { urls } from "~/config/urls";
import logger from "~/logger/logger";

const currentTermsRequired = "2022-05-10";
const currentLendingTermsRequired = "2020-11-10";

function isAcceptedVersionUpToDate(acceptedVersion, currentVersion) {
  if (!acceptedVersion) {
    return false;
  }

  try {
    const acceptedTermsVersion = new Date(acceptedVersion);
    const currentTermsVersion = new Date(currentVersion);

    return acceptedTermsVersion >= currentTermsVersion;
  } catch (error) {
    logger.error(`Failed to parse terms version's dates: ${error}`);

    return false;
  }
}

export function isAcceptedTerms() {
  return isAcceptedVersionUpToDate(
    global.localStorage.getItem("acceptedTermsVersion"),
    currentTermsRequired,
  );
}

export function isAcceptedLendingTerms() {
  return isAcceptedVersionUpToDate(
    global.localStorage.getItem("acceptedLendingTermsVersion"),
    currentLendingTermsRequired,
  );
}

export function acceptTerms() {
  return global.localStorage.setItem("acceptedTermsVersion", currentTermsRequired);
}

export function acceptLendingTerms() {
  return global.localStorage.setItem("acceptedLendingTermsVersion", currentLendingTermsRequired);
}

/* This hook dynamically returns correct url based on user language */
export const useDynamicUrl = (key: string): string => {
  const [url, setUrl] = useState(urls[key].en);
  const language = useSelector(languageSelector);

  useEffect(() => {
    setUrl(urls[key][language] || urls[key].en);
  }, [key, language]);

  return url;
};
