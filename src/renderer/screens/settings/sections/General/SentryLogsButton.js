// @flow

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSentryLogs } from "~/renderer/actions/settings";
import { sentryLogsSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

const SentryLogsButton = () => {
  const dispatch = useDispatch();
  const sentryLogs = useSelector(sentryLogsSelector);

  const onChangeSentryLogs = useCallback(
    (value: boolean) => {
      dispatch(setSentryLogs(value));
    },
    [dispatch],
  );

  return (
    <>
      <Track onUpdate event={sentryLogs ? "SentryEnabled" : "SentryDisabled"} />
      <Switch isChecked={sentryLogs} onChange={onChangeSentryLogs} data-e2e="reportBugs_button" />
    </>
  );
};

export default SentryLogsButton;
