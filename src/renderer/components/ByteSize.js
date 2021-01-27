// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { DeviceModel } from "@ledgerhq/devices";

const k = 1024; // 1kb unit
const sizes = ["bytes", "kbUnit", "mbUnit"];

/** formats a byte value into its correct size in kb or mb unit takling in account the device block size */
const ByteSize = ({
  value,
  deviceModel,
  decimals = 2,
  firmwareVersion,
}: {
  value: number,
  deviceModel: DeviceModel,
  decimals?: number,
  firmwareVersion: string,
}) => {
  if (!value) return "–";

  const blockSize = deviceModel.getBlockSize(firmwareVersion);

  // FIXME it should be on live-common side
  const bytes = Math.ceil(value / blockSize) * blockSize;

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const dm = Math.max(0, decimals);

  return (
    <Trans
      i18nKey={`byteSize.${sizes[i]}`}
      values={{
        size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
      }}
    />
  );
};

export default ByteSize;
