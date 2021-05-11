// @flow
import React from "react";
import { Trans } from "react-i18next";
import Alert from "~/renderer/components/Alert";

const ElectionWarning = () => (
  <Alert type="warning" mb={20}>
    <Trans i18nKey="polkadot.nomination.electionOpen" />
  </Alert>
);

export default ElectionWarning;
