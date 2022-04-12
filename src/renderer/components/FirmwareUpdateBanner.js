// @flow

import React, { useContext } from "react";
import IconNano from "~/renderer/icons/NanoAltSmall";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { latestFirmwareSelector } from "~/renderer/reducers/settings";
import TopBanner, { FakeLink } from "~/renderer/components/TopBanner";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";
import { UpdaterContext } from "~/renderer/components/Updater/UpdaterContext";
import { shouldUpdateYet } from "~/helpers/user";
import { useRemoteConfig } from "~/renderer/components/RemoteConfig";
import { VISIBLE_STATUS } from "./Updater/Banner";

const FirmwareUpdateBanner = ({ old, right }: { old?: boolean, right?: any }) => {
  const history = useHistory();
  const location = useLocation();
  const latestFirmware = useSelector(latestFirmwareSelector);
  const visibleFirmwareVersion =
    process.env.DEBUG_FW_VERSION ||
    (latestFirmware ? getCleanVersion(latestFirmware.final.name) : "");

  const onClick = () => {
    const urlParams = new URLSearchParams({
      firmwareUpdate: "true",
    });
    const search = urlParams.toString();
    history.push({
      pathname: "/manager",
      search: `?${search}`,
    });
  };

  const inManager = location.pathname === "/manager";

  if (!visibleFirmwareVersion || (!right && inManager)) return null;
  // prevents the standard banner in Default.js from being displayed in the manager

  return (
    <TopBanner
      id={"fw-update-banner"}
      content={{
        Icon: IconNano,
        message: (
          <Trans
            i18nKey={
              old ? "manager.firmware.banner.old.warning" : "manager.firmware.banner.warning"
            }
            values={{ latestFirmware: visibleFirmwareVersion }}
          />
        ),
        right: right || (
          <FakeLink onClick={onClick}>
            <Trans i18nKey={"manager.firmware.banner.cta"} />
          </FakeLink>
        ),
      }}
      status={"warning"}
    />
  );
};

const FirmwareUpdateBannerEntry = ({ old, right }: { old?: boolean, right?: any }) => {
  const context = useContext(UpdaterContext);
  const remoteConfig = useRemoteConfig();

  if (
    context &&
    remoteConfig.lastUpdatedAt &&
    context.version &&
    shouldUpdateYet(context.version, remoteConfig)
  ) {
    const { status } = context;

    if (VISIBLE_STATUS.includes(status)) return null;
  }

  return <FirmwareUpdateBanner old={old} right={right} />;
};

export default FirmwareUpdateBannerEntry;
