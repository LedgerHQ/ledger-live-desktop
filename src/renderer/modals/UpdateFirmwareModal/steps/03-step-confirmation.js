// @flow

import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { log } from "@ledgerhq/logs";
import TrackPage from "~/renderer/analytics/TrackPage";
import Track from "~/renderer/analytics/Track";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import CheckCircle from "~/renderer/icons/CheckCircle";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "../";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  fontSize: 4,
  color: "palette.text.shade100",
}))``;

const Title = styled(Box).attrs(() => ({
  fontFamily: "Inter",
  fontSize: 6,
  color: "palette.text.shade100",
}))`
  font-weight: 500;
`;

const StepConfirmation = ({ error }: StepProps) => {
  const { t } = useTranslation();

  useEffect(() => () => log("firmware-record-end"), []);

  if (error) {
    return <ErrorDisplay error={error} withExportLogs />;
  }

  return (
    <Container>
      <TrackPage category="Manager" name="FirmwareConfirmation" />
      <Box mx={7} color="positiveGreen" my={4}>
        <CheckCircle size={44} />
      </Box>
      <Title>{t("manager.modal.successTitle")}</Title>
      <Box mt={2} mb={5}>
        <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
          {t("manager.modal.successText")}
        </Text>
      </Box>
      <Box mx={7} />
    </Container>
  );
};

export const StepConfirmFooter = ({ onCloseModal, error, appsToBeReinstalled }: StepProps) => {
  const { t } = useTranslation();
  if (error || !appsToBeReinstalled) {
    return (
      <Button id="firmware-update-completed-close-button" primary onClick={() => onCloseModal()}>
        {t("common.close")}
      </Button>
    );
  }

  return (
    <>
      <Track event={"FirmwareUpdatedClose"} onUnmount />
      <Button id="firmware-update-completed-close-button" onClick={() => onCloseModal()}>
        {t("common.close")}
      </Button>
      <Button
        id="firmware-update-completed-reinstall-button"
        primary
        onClick={() => onCloseModal(true)}
      >
        Re-install the apps
      </Button>
    </>
  );
};

export default StepConfirmation;
