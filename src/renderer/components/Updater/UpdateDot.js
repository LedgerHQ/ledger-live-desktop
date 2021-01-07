// @flow

import React, { useContext } from "react";
import { shouldUpdateYet } from "~/helpers/user";
import { useRemoteConfig } from "~/renderer/components/RemoteConfig";
import { colors } from "~/renderer/styles/theme";
import type { UpdateStatus } from "./UpdaterContext";
import { UpdaterContext } from "./UpdaterContext";
import { VISIBLE_STATUS } from "./Banner";
import { Dot } from "../Dot";

const getColor = (status: UpdateStatus) => (status === "error" ? colors.alertRed : colors.wallet);

const getOpacity = (status: UpdateStatus) =>
  status === "download-progress" || status === "checking" ? 0.5 : 1;

const UpdateDot = ({ collapsed }: { collapsed: ?boolean }) => {
  const remoteConfig = useRemoteConfig();
  const context = useContext(UpdaterContext);
  if (
    context &&
    remoteConfig.lastUpdatedAt &&
    context.version &&
    shouldUpdateYet(context.version, remoteConfig)
  ) {
    const { status } = context;
    if (!VISIBLE_STATUS.includes(status)) return null;
    return <Dot collapsed={collapsed} color={getColor(status)} opacity={getOpacity(status)} />;
  }

  return null;
};

export default UpdateDot;
