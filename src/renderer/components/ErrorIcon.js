// @flow
import React from "react";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import Warning from "~/renderer/icons/TriangleWarning";
import CrossCircle from "~/renderer/icons/CrossCircle";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Lock from "~/renderer/icons/LockCircle";

import {
  UserRefusedAllowManager,
  UserRefusedFirmwareUpdate,
  UserRefusedOnDevice,
  UserRefusedAddress,
  ManagerDeviceLockedError,
} from "@ledgerhq/errors";

import {
  SwapGenericAPIError,
  DeviceNotOnboarded,
  NoSuchAppOnProvider,
} from "@ledgerhq/live-common/lib/errors";

export type ErrorIconProps = {
  error: Error,
  size?: number,
};

const ErrorIcon = ({ error, size = 44 }: ErrorIconProps) => {
  switch (true) {
    case !error:
      return null;
    case error instanceof DeviceNotOnboarded:
      return <InfoCircle size={size} />;
    case error instanceof UserRefusedFirmwareUpdate:
      return <Warning size={size} />;
    case error instanceof UserRefusedAllowManager:
    case error instanceof UserRefusedOnDevice:
    case error instanceof UserRefusedAddress:
    case error instanceof SwapGenericAPIError:
    case error instanceof NoSuchAppOnProvider:
      return <CrossCircle size={size} />;
    case error instanceof ManagerDeviceLockedError:
      return <Lock size={size} />;

    default:
      return <ExclamationCircleThin size={size} />;
  }
};

export default ErrorIcon;
