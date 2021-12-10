import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { ModalStatus } from "./types";
import { InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { getDeviceModel } from "@ledgerhq/devices";
import manager from "@ledgerhq/live-common/lib/manager";
import { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import { Button, Flex, Icons, Text } from "@ledgerhq/react-ui";

import DisclaimerModal from "~/renderer/modals/DisclaimerModal";
import UpdateModal, { StepId } from "~/renderer/modals/UpdateFirmwareModal";
import Box from "~/renderer/components/Box";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import FirmwareUpdateBanner from "~/renderer/components/FirmwareUpdateBanner";
import { track } from "~/renderer/analytics/segment";

type Props = {
  deviceInfo: DeviceInfo;
  device: Device;
  setFirmwareUpdateOpened: (arg0: boolean) => void;
  disableFirmwareUpdate?: boolean;
  installed?: InstalledItem[];
  onReset: (arg0: string[]) => void;
  firmware: FirmwareUpdateContext;
  error: Error;
  isIncomplete?: boolean;
  openFirmwareUpdate?: boolean;
};

type State = {
  modal: ModalStatus;
  stepId: StepId;
};

const initialStepId = ({ deviceInfo, device }): StepId =>
  deviceInfo.isOSU
    ? "updateMCU"
    : manager.firmwareUpdateNeedsLegacyBlueResetInstructions(deviceInfo, device.modelId)
    ? "resetDevice"
    : "idCheck";

const initializeState = (props: Props): State => ({
  modal: props.deviceInfo.isOSU ? "install" : props.openFirmwareUpdate ? "disclaimer" : "closed",
  stepId: initialStepId(props),
});

class FirmwareUpdate extends PureComponent<Props, State> {
  static defaultProps = {
    disableFirmwareUpdate: false,
  };

  state = initializeState(this.props);

  componentWillUnmount() {
    this._unmounting = true;
  }

  _unmounting = false;

  handleCloseModal = (reinstall?: boolean) => {
    this.setState({ modal: "closed" });
    const { onReset, installed } = this.props;
    if (reinstall && installed) {
      onReset(installed.map(a => a.name));
    }
  };

  handleDisclaimerModal = () => {
    const { firmware } = this.props;
    if (!firmware) return;

    track("Manager Firmware Update Click", {
      firmwareName: firmware.final.name,
    });
    this.setState({ modal: "disclaimer" });
  };

  handleDisclaimerNext = () => this.setState({ modal: "install" });

  render() {
    const {
      deviceInfo,
      device,
      setFirmwareUpdateOpened,
      disableFirmwareUpdate,
      installed,
      firmware,
      error,
    } = this.props;
    let { modal, stepId } = this.state;

    if (error) {
      stepId = "finish"; // need to display the final step with error
    }

    const deviceSpecs = getDeviceModel(device.modelId);

    const isDeprecated = manager.firmwareUnsupported(device.modelId, deviceInfo);

    if (!firmware) {
      if (!isDeprecated) return null;
      return (
        <FirmwareUpdateBanner
          old
          right={
            <Button variant="color" onClick={() => openURL(urls.contactSupport)}>
              <Trans i18nKey="manager.firmware.banner.old.cta" />
            </Button>
          }
        />
      );
    }

    return (
      <>
        <FirmwareUpdateBanner
          right={
            <Flex flexDirection="row" alignItems="center">
              {manager.firmwareUpdateRequiresUserToUninstallApps(device.modelId, deviceInfo) && (
                <Flex px={6} flexDirection="row" alignItems="center">
                  <Icons.InfoMedium size={18} />
                  <Text ml={2} color="inherit" variant="paragraph">
                    <Trans i18nKey="manager.firmware.removeApps" />
                  </Text>
                </Flex>
              )}
              <Button
                variant="color"
                id={"manager-update-firmware-button"}
                disabled={disableFirmwareUpdate}
                onClick={this.handleDisclaimerModal}
              >
                <Trans i18nKey="manager.firmware.banner.cta2" />
              </Button>
            </Flex>
          }
        />
        <DisclaimerModal
          modelId={device.modelId}
          firmware={firmware}
          deviceInfo={deviceInfo}
          status={modal}
          goToNextStep={this.handleDisclaimerNext}
          onClose={this.handleCloseModal}
        />
        <UpdateModal
          withAppsToReinstall={
            !!installed &&
            installed.length > 0 &&
            manager.firmwareUpdateWillUninstallApps(deviceInfo, device.modelId)
          }
          withResetStep={manager.firmwareUpdateNeedsLegacyBlueResetInstructions(
            deviceInfo,
            device.modelId,
          )}
          status={modal}
          stepId={stepId}
          installed={installed}
          onClose={this.handleCloseModal}
          firmware={firmware}
          deviceInfo={deviceInfo}
          error={error}
          deviceModelId={deviceSpecs.id}
          setFirmwareUpdateOpened={setFirmwareUpdateOpened}
        />
      </>
    );
  }
}

export default FirmwareUpdate;
