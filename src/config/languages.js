// @flow
import { getEnv } from "@ledgerhq/live-common/lib/env";

export const allLanguages = [
  "de",
  "el",
  "en",
  "es",
  "fi",
  "fr",
  "hu",
  "it",
  "ja",
  "ko",
  "nl",
  "no",
  "pl",
  "pt",
  "ru",
  "sr",
  "sv",
  "tr",
  "zh",
];

export const prodStableLanguages = ["en", "fr", "es", "ru", "zh", "de", "tr", "ja", "ko"];

export const getLanguages = () =>
  getEnv("EXPERIMENTAL_LANGUAGES") ? allLanguages : prodStableLanguages;
