// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Alert from "~/renderer/components/Alert";
import Button from "~/renderer/components/Button";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import type { DeviceModelId } from "@ledgerhq/devices";
import Track from "~/renderer/analytics/Track";
import styled from "styled-components";
import recoverySeedWarning from "~/renderer/images/recoverySeedWarning.png";

type Props = {
  onClose: () => void,
};

const Illustration = styled.div`
  background-image: url(${p => p.image});
  background-size: contain;
  background-position: center center;
  background-repeat: no-repeat;
  width: ${p => p.width}px;
  height: ${p => p.height}px;
  align-self: center;
`;

type ModalRenderProps = {
  onClose: () => void,
  data: {
    deviceId: DeviceModelId,
  },
};

const RecoverySeedWarning = ({ onClose, ...props }: Props) => {
  const { t } = useTranslation();
  const onContactSupport = useCallback(() => openURL(urls.contactSupport), []);
  return (
    <Modal
      centered
      preventBackdropClick
      name="MODAL_RECOVERY_SEED_WARNING"
      render={({ onClose, data: { deviceModelId } }: ModalRenderProps) => {
        return (
          <ModalBody
            onClose={onClose}
            render={() => (
              <Box>
                <Illustration image={recoverySeedWarning} width={198} height={108} />
                <Text
                  mt={6}
                  textAlign="center"
                  ff="Inter|SemiBold"
                  fontSize={6}
                  color="palette.text.shade100"
                >
                  {t("onboarding.modals.recoverySeedWarning.title")}
                </Text>
                <Text
                  textAlign="center"
                  ff="Inter|Regular"
                  fontSize={4}
                  color="palette.text.shade100"
                  mb={6}
                  mt={3}
                >
                  {t("onboarding.modals.recoverySeedWarning.description", {
                    device: getDeviceModel(deviceModelId).productName,
                  })}
                </Text>
                <Alert type="danger">{t("onboarding.modals.recoverySeedWarning.alert")}</Alert>
              </Box>
            )}
            renderFooter={() => (
              <Box horizontal alignItems="center" justifyContent="flex-end">
                <Button
                  onClick={onContactSupport}
                  event="OnboardingRecoverySeedWarning-contactSupport"
                  id="onboarding-recoverySeedWarning-contactSupport"
                >
                  <Text>{t("onboarding.modals.recoverySeedWarning.contactSupportCTA")}</Text>
                </Button>
                <Button
                  ml={2}
                  onClick={onClose}
                  primary
                  event="OnboardingRecoverySeedWarning-continue"
                  id="onboarding-recoverySeedWarning-continue"
                >
                  <Text>{t("onboarding.modals.recoverySeedWarning.continueCTA")}</Text>
                </Button>
                <Track onMount event="Onboarding - Recovery seed warning displayed" />
              </Box>
            )}
          />
        );
      }}
    />
  );
};

export default RecoverySeedWarning;
