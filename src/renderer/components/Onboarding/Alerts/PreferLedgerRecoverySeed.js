// @flow

import React from "react";
import {
  AlertModalContainer,
  AlertIconContainer,
} from "~/renderer/components/Onboarding/Alerts/shared";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import Text from "~/renderer/components/Text";
import { useTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";

type Props = {
  onClose: () => void,
};

export function PreferLedgerRecoverySeed({ onClose }: Props) {
  const { t } = useTranslation();

  return (
    <AlertModalContainer>
      <AlertIconContainer>
        <TriangleWarning size={20} />
      </AlertIconContainer>
      <Text
        mt="17px"
        lineHeight="21.78px"
        color="palette.text.shade100"
        ff="Inter|SemiBold"
        fontSize="18px"
      >
        {t("onboarding.alerts.useLedgerSeeds.title")}
      </Text>
      <Text
        mt="8px"
        mb="17px"
        lineHeight="19.5px"
        color="palette.text.shade100"
        ff="Inter|Regular"
        fontSize="13px"
      >
        {t("onboarding.alerts.useLedgerSeeds.descr")}
      </Text>
      <Button primary onClick={onClose}>
        <Text
          lineHeight="18px"
          color="palette.primary.contrastText"
          ff="Inter|Bold"
          fontSize="12px"
        >
          {t("onboarding.alerts.useLedgerSeeds.gotIt")}
        </Text>
      </Button>
    </AlertModalContainer>
  );
}
