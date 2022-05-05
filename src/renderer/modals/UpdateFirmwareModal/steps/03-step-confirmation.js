// @flow

import React, { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { log } from "@ledgerhq/logs";
import { UserRefusedFirmwareUpdate } from "@ledgerhq/errors";
import { useHistory } from "react-router-dom";
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

const StepConfirmation = ({ error, appsToBeReinstalled }: StepProps) => {
  const { t } = useTranslation();

  useEffect(() => () => log("firmware-record-end"), []);

  if (error) {
    const isUserRefusedFirmwareUpdate = error instanceof UserRefusedFirmwareUpdate;
    return (
      <ErrorDisplay
        error={error}
        warning={isUserRefusedFirmwareUpdate}
        withExportLogs={!isUserRefusedFirmwareUpdate}
      />
    );
  }

  return (
    <Container data-test-id="firmware-update-done">
      <TrackPage category="Manager" name="FirmwareConfirmation" />
      <Box mx={7} color="positiveGreen" my={4}>
        <CheckCircle size={44} />
      </Box>
      <Title>{t("manager.modal.successTitle")}</Title>
      <Box mt={2} mb={5}>
        <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80">
          {appsToBeReinstalled
            ? t("manager.modal.successTextApps")
            : t("manager.modal.successTextNoApps")}
        </Text>
      </Box>
      <Box mx={7} />
    </Container>
  );
};

export const StepConfirmFooter = ({
  onCloseModal,
  error,
  appsToBeReinstalled,
  onRetry,
}: StepProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onCloseReload = useCallback(() => {
    onCloseModal();
    if (error instanceof UserRefusedFirmwareUpdate) {
      history.push("/manager/reload");
    }
  }, [error, history, onCloseModal]);

  if (error) {
    const isUserRefusedFirmwareUpdate = error instanceof UserRefusedFirmwareUpdate;
    return (
      <>
        <Button
          id="firmware-update-completed-close-button"
          primary={!isUserRefusedFirmwareUpdate}
          onClick={onCloseReload}
        >
          {t("common.close")}
        </Button>
        {isUserRefusedFirmwareUpdate ? (
          <Button id="firmware-update-completed-restart-button" primary onClick={() => onRetry()}>
            {t("manager.modal.cancelReinstallCTA")}
          </Button>
        ) : null}
      </>
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
        onClick={() => onCloseModal(appsToBeReinstalled)}
      >
        {appsToBeReinstalled
          ? t("manager.modal.sucessCTAApps")
          : t("manager.modal.SuccessCTANoApps")}
      </Button>
    </>
  );
};

export default StepConfirmation;
