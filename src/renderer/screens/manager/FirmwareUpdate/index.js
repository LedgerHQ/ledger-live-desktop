// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import type { InstalledItem } from "@ledgerhq/live-common/lib/apps/types";
import manager from "@ledgerhq/live-common/lib/manager";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import type { Device } from "~/renderer/reducers/devices";
import DisclaimerModal from "~/renderer/modals/DisclaimerModal";
import UpdateModal from "~/renderer/modals/UpdateFirmwareModal";
import type { StepId } from "~/renderer/modals/UpdateFirmwareModal";
import Text from "~/renderer/components/Text";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import Box from "~/renderer/components/Box";
import UpdateFirmwareButton from "./UpdateFirmwareButton";
import type { ModalStatus } from "./types";

type Props = {
  deviceInfo: DeviceInfo,
  device: Device,
  setFirmwareUpdateOpened: boolean => void,
  disableFirmwareUpdate?: boolean,
  installed?: InstalledItem[],
  onReset: (string[]) => void,
  firmware: ?FirmwareUpdateContext,
  error: ?Error,
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
  modal: props.deviceInfo.isOSU ? "install" : "closed",
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

    if (!firmware) return null;

    const deviceSpecs = getDeviceModel(device.modelId);

    return (
      <Box
        py={2}
        px={4}
        bg="blueTransparentBackground"
        horizontal
        alignItems="center"
        justifyContent="space-between"
        borderRadius={1}
      >
        <Box flex="1">
          <Text ff="Inter|SemiBold" fontSize={5} color="palette.primary.main">
            <Trans
              i18nKey="manager.firmware.latest"
              values={{ version: getCleanVersion(firmware.final.name) }}
            />
          </Text>
        </Box>

        {manager.firmwareUpdateRequiresUserToUninstallApps(device.modelId, deviceInfo) && (
          <Box px={4} horizontal alignItems="center" color="palette.primary.main">
            <IconInfoCircle size={12} />
            <Text style={{ marginLeft: 6 }} ff="Inter" fontSize={4}>
              <Trans i18nKey="manager.firmware.removeApps" />
            </Text>
          </Box>
        )}
        <UpdateFirmwareButton
          deviceInfo={deviceInfo}
          firmware={firmware}
          onClick={this.handleDisclaimerModal}
          disabled={disableFirmwareUpdate}
        />

        <DisclaimerModal
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
      </Box>
    );
  }
}

export default FirmwareUpdate;
