// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import type { ModalStatus } from "./types";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import { getDeviceModel } from "@ledgerhq/devices";
import manager from "@ledgerhq/live-common/lib/manager";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import DisclaimerModal from "~/renderer/modals/DisclaimerModal";
import UpdateModal from "~/renderer/modals/UpdateFirmwareModal";
import type { StepId } from "~/renderer/modals/UpdateFirmwareModal";
import Text from "~/renderer/components/Text";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import Box from "~/renderer/components/Box";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import FirmwareUpdateBanner from "~/renderer/components/FirmwareUpdateBanner";
import { FakeLink } from "~/renderer/components/TopBanner";
import { track } from "~/renderer/analytics/segment";

type Props = {
  deviceInfo: DeviceInfo,
  device: Device,
  setFirmwareUpdateOpened: boolean => void,
  disableFirmwareUpdate?: boolean,
  installed?: InstalledItem[],
  onReset: (string[]) => void,
  firmware: ?FirmwareUpdateContext,
  error: ?Error,
  isIncomplete?: boolean,
  openFirmwareUpdate?: boolean,
};

type State = {
  modal: ModalStatus,
  stepId: StepId,
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
            <FakeLink onClick={() => openURL(urls.contactSupport)}>
              <Trans i18nKey="manager.firmware.banner.old.cta" />
            </FakeLink>
          }
        />
      );
    }

    return (
      <>
        <FirmwareUpdateBanner
          right={
            <Box alignItems={"flex-end"} horizontal>
              {manager.firmwareUpdateRequiresUserToUninstallApps(device.modelId, deviceInfo) && (
                <Box px={4} horizontal alignItems="center" color="palette.primary.contrastText">
                  <IconInfoCircle size={12} />
                  <Text style={{ marginLeft: 6 }} ff="Inter" fontSize={4}>
                    <Trans i18nKey="manager.firmware.removeApps" />
                  </Text>
                </Box>
              )}
              <FakeLink
                data-test-id="manager-update-firmware-button"
                disabled={disableFirmwareUpdate}
                onClick={this.handleDisclaimerModal}
              >
                <Trans i18nKey="manager.firmware.banner.cta2" />
              </FakeLink>
            </Box>
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
