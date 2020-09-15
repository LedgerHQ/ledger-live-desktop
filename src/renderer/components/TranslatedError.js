// @flow
// Convention:
// - errors we throw on our app will use a different error.name per error type
// - an error can have parameters, to use them, just use field of the Error object, that's what we give to `t()`
// - returned value is intentially not styled (is universal). wrap this in whatever you need

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import logger from "~/logger";

type Props = {
  error: ?Error,
  t: TFunction,
  field: "title" | "description" | "list",
};

class TranslatedError extends PureComponent<Props> {
  static defaultProps = {
    field: "title",
  };

  render() {
    const { t, error, field } = this.props;
    if (!error) return null;
    if (typeof error !== "object") {
      // this case should not happen (it is supposed to be a ?Error)
      logger.critical(`TranslatedError invalid usage: ${String(error)}`);
      if (typeof error === "string") {
        return error; // TMP in case still used somewhere
      }
      return null;
    }
    // $FlowFixMe
    const arg: Object = Object.assign({ message: error.message, returnObjects: true }, error);
    if (error.name) {
      const translation = t(`errors.${error.name}.${field}`, arg);
      if (translation !== `errors.${error.name}.${field}`) {
        // It is translated
        if (translation && typeof translation === "object") {
          // It is a list
          return Object.entries(translation).map(([key, str]) =>
            typeof str === "string" ? <li key={key}>{str}</li> : null,
          );
        }
        return translation;
      }
    }

    const genericTranslation = t(`errors.generic.${field}`, arg);
    return genericTranslation === `errors.generic.${field}` ? null : genericTranslation;
  }
}

export default withTranslation()(TranslatedError);
