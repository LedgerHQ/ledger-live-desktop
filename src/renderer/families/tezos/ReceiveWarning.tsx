// @flow
import React from "react";
import { Trans } from "react-i18next";
import { Alert, Button } from "@ledgerhq/react-ui";

const ReceiveWarning = () => (
  <Alert type="info" renderContent={() => <Trans i18nKey="receive.steps.warning.tezos.text" />} />
);

const ReceiveWarningFooter = ({ onContinue }: { onContinue: () => void }) => (
  <>
    <Button onClick={onContinue} variant="main" alignSelf="flex-end">
      <Trans i18nKey="common.continue" />
    </Button>
  </>
);

export default {
  component: ReceiveWarning,
  footer: ReceiveWarningFooter,
};
