// @flow
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import type { StepProps } from "../types";

export default function StepConfirmation() {
  return <div>Step Confirmation</div>;
}

export function StepConfirmationFooter({ onClose }: StepProps) {
  const { t } = useTranslation();

  const onViewDetails = useCallback(() => {}, []);

  return (
    <>
      <Box horizontal>
        <Button mr={1} secondary onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button primary onClick={onViewDetails}>
          {t("common.continue")}
        </Button>
      </Box>
    </>
  );
}
