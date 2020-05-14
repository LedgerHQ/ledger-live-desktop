// @flow
import invariant from "invariant";
import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import type { StepProps } from "../types";

export default function StepAmount() {
  return <div>Step Amount</div>;
}

export function StepAmountFooter({
  transitionTo,
  account,
  onClose,
  status: { errors = {} },
  bridgePending,
  transaction,
}: StepProps) {
  const { t } = useTranslation();

  invariant(account, "account required");

  const hasErrors = !!Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button disabled={!canNext} primary onClick={() => transitionTo("device")}>
          {t("common.continue")}
        </Button>
      </Box>
    </>
  );
}
