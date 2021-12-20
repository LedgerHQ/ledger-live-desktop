import React, { PureComponent } from "react";
import { DeviceModelId } from "@ledgerhq/devices";
import { Trans, withTranslation, TFunction } from "react-i18next";
import styled from "styled-components";
import { FinalFirmware, OsuFirmware } from "@ledgerhq/live-common/lib/types/manager";
import { urls } from "~/config/urls";
import TrackPage from "~/renderer/analytics/TrackPage";
import Track from "~/renderer/analytics/Track";
import { openURL } from "~/renderer/linking";
import Button from "~/renderer/components/Button";
import Markdown, { Notes } from "~/renderer/components/Markdown";
import Box from "~/renderer/components/Box";
import { ModalStatus } from "~/renderer/screens/manager/FirmwareUpdate/types";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";
import { Icons, Checkbox, Drawer, Alert, Flex, Link, Text } from "@ledgerhq/react-ui";

type Props = {
  t: TFunction;
  status: ModalStatus;
  firmware: {
    osu: OsuFirmware;
    final: FinalFirmware;
  };
  goToNextStep: () => void;
  onClose: () => void;
  modelId: DeviceModelId;
};

type State = any;

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

  render(): React.ReactNode {
    const { status, firmware, modelId, t, goToNextStep } = this.props;
    const { seedReady } = this.state;

    const supportURL = urls.updateDeviceFirmware[modelId] || "";
    const dontHaveSeedURL = urls.lostPinOrSeed[modelId] || "";

    return (
      <Drawer
        isOpen={status === "disclaimer"}
        big
        onClose={this.onClose}
        footer={
          <Flex flexDirection="row" flex={1} justifyContent="flex-end" alignItems="center">
            <Flex flexDirection="row" flex={1} alignItems="center" onClick={this.onSeedReady}>
              <Checkbox
                id={"firmware-update-disclaimer-modal-seed-ready-checkbox"}
                variant="default"
                isChecked={this.state.seedReady}
                onChange={this.onSeedReady}
              />
              <Text ml={5} variant="paragraph" fontWeight="medium" color="neutral.c80">
                {t("manager.firmware.seedReady")}
              </Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center">
              <Button
                id={"firmware-update-disclaimer-modal-close-button"}
                onClick={() => this.onClose()}
              >
                {t("manager.firmware.updateLater")}
              </Button>
              <Button
                id={"firmware-update-disclaimer-modal-continue-button"}
                disabled={!this.state.seedReady}
                variant="main"
                onClick={goToNextStep}
                ml={10}
              >
                {t("common.continue")}
              </Button>
            </Flex>
          </Flex>
        }
      >
        <Flex flex={1} flexDirection="column" alignItems="center" justifyContent="space-between">
          <Text variant="h3" mb={8}>
            {t("manager.firmware.update")}
          </Text>
          <Box alignItems="center">
            <TrackPage category="Manager" name="DisclaimerModal" />
            <Track onUpdate event="FirmwareUpdateSeedDisclaimerChecked" checked={seedReady} />
            <Text
              variant="paragraph"
              fontWeight="medium"
              color="neutral.c80"
              textAlign="center"
              mb={3}
            >
              <Trans
                i18nKey="manager.firmware.disclaimerTitle"
                values={{
                  version: firmware && firmware.final ? getCleanVersion(firmware.final.name) : "",
                }}
              >
                {"You are about to install"}
                <Text color="neutral.c100">{"firmware version {{version}}"}</Text>
              </Trans>
            </Text>
            <Link mb={12} Icon={Icons.ExternalLinkMedium} onClick={() => openURL(supportURL)}>
              {t("manager.firmware.followTheGuide")}
            </Link>
            <Alert
              containerProps
              type="info"
              renderContent={({ color, textProps }) => (
                <Text color={color} {...textProps}>
                  {t("manager.firmware.prepareSeed")}{" "}
                  <Link
                    onClick={() => openURL(dontHaveSeedURL)}
                    color={color}
                    textProps={{ ...textProps, fontWeight: "semiBold" }}
                    size="small"
                  >
                    {t("manager.firmware.dontHaveSeed")}
                  </Link>
                </Text>
              )}
            />
            {firmware && firmware.osu ? (
              <Flex mt={14} position="relative">
                <Notes>
                  <Markdown>{firmware.osu.notes}</Markdown>
                </Notes>
              </Flex>
            ) : null}
          </Box>
        </Flex>
      </Drawer>
    );
  }
}

export default withTranslation()(DisclaimerModal);
