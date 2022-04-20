// @flow

import React, { PureComponent } from "react";
import type { DeviceModelId } from "@ledgerhq/devices";
import { Trans, withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import type { FinalFirmware, OsuFirmware } from "@ledgerhq/live-common/lib/types/manager";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import Track from "~/renderer/analytics/Track";
import { openURL } from "~/renderer/linking";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Markdown, { Notes } from "~/renderer/components/Markdown";
import Alert from "~/renderer/components/Alert";
import CheckBox from "~/renderer/components/CheckBox";
import FakeLink from "~/renderer/components/FakeLink";
import Box from "~/renderer/components/Box";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import type { ModalStatus } from "~/renderer/screens/manager/FirmwareUpdate/types";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";

type Props = {
  t: TFunction,
  status: ModalStatus,
  firmware: {
    osu: OsuFirmware,
    final: FinalFirmware,
  },
  goToNextStep: () => void,
  onClose: () => void,
  modelId: DeviceModelId,
};

type State = *;

const NotesWrapper = styled(Box)`
  margin-top: 8px;
  position: relative;
`;

class DisclaimerModal extends PureComponent<Props, State> {
  state = {
    seedReady: false,
  };

  onClose = () => {
    this.setState({
      seedReady: false,
    });
    this.props.onClose();
  };

  onSeedReady = () => this.setState(state => ({ seedReady: !state.seedReady }));

  render(): React$Node {
    const { status, firmware, modelId, t, goToNextStep } = this.props;
    const { seedReady } = this.state;

    const supportURL = urls.updateDeviceFirmware[modelId] || "";
    const dontHaveSeedURL = urls.lostPinOrSeed[modelId] || "";

    return (
      <Modal isOpened={status === "disclaimer"} backdropColor centered onClose={this.onClose}>
        <ModalBody
          grow
          alignItems="center"
          justifyContent="center"
          mt={3}
          title={t("manager.firmware.update")}
          render={() => (
            <Box alignItems="center">
              <TrackPage category="Manager" name="DisclaimerModal" />
              <Track onUpdate event="FirmwareUpdateSeedDisclaimerChecked" checked={seedReady} />
              <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80" textAlign="center">
                <Trans
                  i18nKey="manager.firmware.disclaimerTitle"
                  values={{
                    version: firmware && firmware.final ? getCleanVersion(firmware.final.name) : "",
                  }}
                >
                  {"You are about to install"}
                  <Text ff="Inter|SemiBold" color="palette.text.shade100">
                    {"firmware version {{version}}"}
                  </Text>
                </Trans>
              </Text>
              <FakeLink onClick={() => openURL(supportURL)}>
                <Text ff="Inter|SemiBold" fontSize={4} style={{ textDecoration: "underline" }}>
                  {t("manager.firmware.followTheGuide")}
                </Text>
                <IconChevronRight size={14} style={{ marginLeft: 4 }} />
              </FakeLink>
              <Alert
                type="primary"
                learnMoreUrl={dontHaveSeedURL}
                learnMoreLabel={t("manager.firmware.dontHaveSeed")}
                mt={4}
              >
                {t("manager.firmware.prepareSeed")}
              </Alert>
              {firmware && firmware.osu ? (
                <NotesWrapper>
                  <Notes>
                    <Markdown>{firmware.osu.notes}</Markdown>
                  </Notes>
                </NotesWrapper>
              ) : null}
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end" alignItems="center" style={{ flex: 1 }}>
              <Box horizontal alignItems="center" onClick={this.onSeedReady} style={{ flex: 1 }}>
                <CheckBox
                  data-test-id="firmware-update-ready-checkbox"
                  isChecked={this.state.seedReady}
                  onChange={this.onSeedReady}
                />
                <Text
                  ff="Inter|SemiBold"
                  fontSize={4}
                  style={{ marginLeft: 8, overflowWrap: "break-word", flex: 1 }}
                >
                  {t("manager.firmware.seedReady")}
                </Text>
              </Box>
              <Box horizontal>
                <Button data-test-id="modal-close-button" onClick={() => this.onClose()}>
                  {t("manager.firmware.updateLater")}
                </Button>
                <Button
                  data-test-id="modal-continue-button"
                  disabled={!this.state.seedReady}
                  primary
                  onClick={goToNextStep}
                  style={{ marginLeft: 10 }}
                >
                  {t("common.continue")}
                </Button>
              </Box>
            </Box>
          )}
        />
      </Modal>
    );
  }
}

export default withTranslation()(DisclaimerModal);
