// Convention:
// - errors we throw on our app will use a different error.name per error type
// - an error can have parameters, to use them, just use field of the Error object, that's what we give to `t()`
// - returned value is intentially not styled (is universal). wrap this in whatever you need

import React from "react";
import { useTranslation } from "react-i18next";
import logger from "~/logger";

type Props = {
  error?: Error;
  field?: "title" | "description" | "list";
};

const TranslatedError = ({ error, field = "title" }: Props): React.ReactElement | null => {
  const { t } = useTranslation();

  if (!error) return null;

  if (typeof error !== "object") {
    // TODO: V3 - Fix me as soon as we type correctly the logger function
    ((logger as unknown) as { critical: (message: string) => {} }).critical(
      `TranslatedError invalid usage: ${String(error)}`,
    );

    if (typeof error === "string") {
      return error; // TMP in case still used somewhere
    }

    return null;
  }

  const arg = Object.assign({ message: error.message, returnObjects: true }, error);

  if (error.name) {
    const translation = t(`errors.${error.name}.${field}`, arg);
    if (translation !== `errors.${error.name}.${field}`) return <>{translation}</>;
  }

  const genericTranslation = t(`errors.generic.${field}`, arg);
  return genericTranslation === `errors.generic.${field}` ? null : <>{genericTranslation}</>;
};

export default React.memo(TranslatedError);
