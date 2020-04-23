// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import type {
  OsuFirmware,
  FinalFirmware,
  DeviceInfo,
} from "@ledgerhq/live-common/lib/types/manager";
import Button from "~/renderer/components/Button";

type Props = {
  firmware: { osu: OsuFirmware, final: FinalFirmware },
  onClick: () => void,
  deviceInfo: DeviceInfo,
  disabled?: boolean,
};

const UpdateFirmwareButton = ({ firmware, onClick, deviceInfo, disabled = false }: Props) => {
  const { t } = useTranslation();

  return (
    <Button
      primary
      onClick={onClick}
      id={"manager-update-firmware-button"}
      event={"Manager Firmware Update Click"}
      eventProperties={{
        firmwareName: firmware.final.name,
      }}
      disabled={disabled}
    >
      {t("manager.firmware.updateBtn")}
    </Button>
  );
};

export default UpdateFirmwareButton;
