// @flow

import React from "react";
import { urls } from "~/config/urls";
import TranslatedError from "./TranslatedError";
import Alert from "./Alert";

type Props = {
  error: Error,
  warning?: boolean,
};

const ErrorBanner = ({ error, warning }: Props) => {
  const maybeUrl = error ? urls.errors[error.name] : null;

  return (
    <Alert
      type={warning ? "warning" : "error"}
      title={<TranslatedError error={error} />}
      learnMoreUrl={maybeUrl}
      mb={4}
    >
      <TranslatedError error={error} field="description" />
    </Alert>
  );
};
export default ErrorBanner;
