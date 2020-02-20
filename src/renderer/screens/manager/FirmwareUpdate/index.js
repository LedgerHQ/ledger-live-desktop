// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { getDeviceModel } from "@ledgerhq/devices";
import type { DeviceInfo, FirmwareUpdateContext } from "@ledgerhq/live-common/lib/types/manager";
import { command } from "~/renderer/commands";
import type { Device } from "~/renderer/reducers/devices";
import DisclaimerModal from "~/renderer/modals/DisclaimerModal";
import UpdateModal from "~/renderer/modals/UpdateFirmwareModal";
import type { StepId } from "~/renderer/modals/UpdateFirmwareModal";
import lte from "semver/functions/lte";
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
};

type State = {
  firmware: ?FirmwareUpdateContext,
  modal: ModalStatus,
  stepId: StepId,
  ready: boolean,
  error: ?Error,
};

const initialStepId = ({ deviceInfo, device }): StepId =>
  deviceInfo.isOSU
    ? "updateMCU"
    : getDeviceModel(device.modelId).id === "blue"
    ? "resetDevice"
    : "idCheck";

const initializeState = (props: Props): State => ({
  firmware: null,
  modal: "closed",
  stepId: initialStepId(props),
  ready: false,
  error: null,
});

class FirmwareUpdate extends PureComponent<Props, State> {
  state = initializeState(this.props);

  async componentDidMount() {
    const { deviceInfo } = this.props;
    try {
      const firmware = await command("getLatestFirmwareForDevice")(deviceInfo).toPromise();
      if (firmware && !this._unmounting) {
        this.setState({
          firmware,
          ready: true,
          modal: deviceInfo.isOSU ? "install" : "closed",
          stepId: initialStepId(this.props),
        });
      }
    } catch (error) {
      this.setState({
        ready: true,
        modal: deviceInfo.isOSU ? "install" : "closed",
        stepId: "finish",
        error,
      });
    }
  }

  componentWillUnmount() {
    this._unmounting = true;
  }

  _unmounting = false;

  handleCloseModal = () => {
    this.setState({ modal: "closed" });
  };

  handleDisclaimerModal = () => {
    this.setState({ modal: "disclaimer" });
  };

  handleDisclaimerNext = () => this.setState({ modal: "install" });

  render() {
    const { deviceInfo, device, setFirmwareUpdateOpened } = this.props;
    const { firmware, modal, stepId, ready, error } = this.state;

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

        {lte(deviceInfo.version, "1.4.2") && (
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
        />

        {ready ? (
          <>
            <DisclaimerModal
              firmware={firmware}
              deviceInfo={deviceInfo}
              status={modal}
              goToNextStep={this.handleDisclaimerNext}
              onClose={this.handleCloseModal}
            />
            <UpdateModal
              status={modal}
              stepId={stepId}
              onClose={this.handleCloseModal}
              firmware={firmware}
              error={error}
              deviceModelId={deviceSpecs.id}
              setFirmwareUpdateOpened={setFirmwareUpdateOpened}
            />
          </>
        ) : null}
      </Box>
    );
  }
}

export default FirmwareUpdate;
