// @flow
import React from "react";
import { Trans } from "react-i18next";
import type { DeviceModel } from "@ledgerhq/devices";

const ByteSize = ({ value, deviceModel }: { value: number, deviceModel: DeviceModel }) =>
  !value ? (
    "–"
  ) : (
    <Trans
      i18nKey="byteSize.kbUnit"
      values={{
        size: ((Math.ceil(value / deviceModel.blockSize) * deviceModel.blockSize) / 1024).toFixed(
          0,
        ),
      }}
    />
  );

export default ByteSize;
