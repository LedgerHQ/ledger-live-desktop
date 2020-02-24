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
}: {
  value: number,
  deviceModel: DeviceModel,
  decimals?: number,
}) => {
  if (!value) return "–";

  const bytes = Math.ceil(value / deviceModel.blockSize) * deviceModel.blockSize;

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
