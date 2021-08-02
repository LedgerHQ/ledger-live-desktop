// @flow

import React from "react";
import IconNano from "~/renderer/icons/NanoAltSmall";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { latestFirmwareSelector } from "~/renderer/reducers/settings";
import TopBanner, { FakeLink } from "~/renderer/components/TopBanner";
import getCleanVersion from "~/renderer/screens/manager/FirmwareUpdate/getCleanVersion";

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
      pathname: "manager",
      search: `?${search}`,
    });
  };

  const inManager = location.pathname === "/manager";

  return !visibleFirmwareVersion ? null : right || !inManager ? (
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
  ) : null;
};

export default FirmwareUpdateBanner;
