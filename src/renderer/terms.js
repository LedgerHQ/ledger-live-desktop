// @flow
import { useEffect, useState } from "react";

import network from "@ledgerhq/live-common/lib/network";
import { useSelector } from "react-redux";
import { languageSelector } from "~/renderer/reducers/settings";

const getRawLanguageURL = (language: string) =>
  `https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERMS-${language}.md`;
const rawDefaultURL =
  "https://raw.githubusercontent.com/LedgerHQ/ledger-live-desktop/master/TERMS.md";
export const url = "https://github.com/LedgerHQ/ledger-live-desktop/blob/master/TERMS.md";

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

export async function load(language: string) {
  try {
    const { data } = await network({ url: getRawLanguageURL(language) });
    return data;
  } catch (error) {
    if (error.status === 404) {
      const { data } = await network({ url: rawDefaultURL });
      return data;
    }
    throw error;
  }
}

export const useTerms = () => {
  const [terms, setTerms] = useState(null);
  const [error, setError] = useState(null);

  const language = useSelector(languageSelector);
  useEffect(() => {
    load(language).then(setTerms, setError);
  }, [language]);

  return [terms, error];
};
