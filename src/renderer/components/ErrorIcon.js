// @flow
import React from "react";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import CrossCircle from "~/renderer/icons/CrossCircle";
import Lock from "~/renderer/icons/LockCircle";

import {
  UserRefusedAllowManager,
  UserRefusedFirmwareUpdate,
  UserRefusedOnDevice,
  UserRefusedAddress,
  ManagerDeviceLockedError,
} from "@ledgerhq/errors";

import { SwapGenericAPIError } from "@ledgerhq/live-common/lib/errors";

export type ErrorIconProps = {
  error: Error,
  size?: number,
};

const ErrorIcon = ({ error, size = 44 }: ErrorIconProps) => {
  switch (true) {
    case !error:
      return null;
    case error instanceof UserRefusedAllowManager:
    case error instanceof UserRefusedFirmwareUpdate:
    case error instanceof UserRefusedOnDevice:
    case error instanceof UserRefusedAddress:
    case error instanceof SwapGenericAPIError:
      return <CrossCircle size={size} />;
    case error instanceof ManagerDeviceLockedError:
      return <Lock size={size} />;

    default:
      return <ExclamationCircleThin size={size} />;
  }
};

export default ErrorIcon;
