// @flow

import React, { useContext, useCallback } from "react";
import { Trans } from "react-i18next";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

import IconUpdate from "~/renderer/icons/Update";
import IconDonjon from "~/renderer/icons/Donjon";
import IconWarning from "~/renderer/icons/TriangleWarning";
import IconInfoCircle from "~/renderer/icons/InfoCircle";

import Spinner from "~/renderer/components/Spinner";
import TopBanner, { FakeLink } from "~/renderer/components/TopBanner";
import type { Content } from "~/renderer/components/TopBanner";

import { UpdaterContext } from "./UpdaterContext";

export const VISIBLE_STATUS = ["download-progress", "checking", "check-success", "error"];

const CONTENT_BY_STATUS = (quitAndInstall, reDownload, progress): { [string]: Content } => ({
  "download-progress": {
    Icon: Spinner,
    message: <Trans i18nKey="update.downloadInProgress" />,
    right: <Trans i18nKey="update.downloadProgress" values={{ progress }} />,
  },
  checking: {
    Icon: IconDonjon,
    message: <Trans i18nKey="update.checking" />,
  },
  "check-success": {
    Icon: IconUpdate,
    message: <Trans i18nKey="update.checkSuccess" />,
    right: (
      <FakeLink onClick={quitAndInstall}>
        <Trans i18nKey="update.quitAndInstall" />
      </FakeLink>
    ),
  },
  error: {
    Icon: IconWarning,
    message: <Trans i18nKey="update.error" />,
    right: (
      <FakeLink onClick={reDownload}>
        <Trans i18nKey="update.reDownload" />
      </FakeLink>
    ),
  },
});

const UpdaterTopBanner = () => {
  const context = useContext(UpdaterContext);

  const reDownload = useCallback(() => {
    openURL(urls.liveHome);
  }, []);

  if (context) {
    const { status, quitAndInstall, downloadProgress } = context;

    if (!VISIBLE_STATUS.includes(status)) return null;

    let content: ?Content = CONTENT_BY_STATUS(quitAndInstall, reDownload, downloadProgress)[status];

    if (!content) return null;

    if (__APP_VERSION__.includes("nightly")) {
      content = {
        Icon: IconInfoCircle,
        message: <Trans i18nKey="update.nightlyWarning" />,
        right: (
          <FakeLink onClick={() => openURL(urls.liveHome)}>
            <Trans i18nKey="update.downloadNow" />
          </FakeLink>
        ),
      };
    }

    return <TopBanner content={content} status={status} />;
  }

  return null;
};

export default UpdaterTopBanner;
