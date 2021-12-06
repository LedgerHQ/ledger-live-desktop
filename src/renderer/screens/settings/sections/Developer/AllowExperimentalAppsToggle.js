// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allowExperimentalAppsSelector } from "~/renderer/reducers/settings";
import { setAllowExperimentalApps } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

const AllowExperimentalAppsToggle = () => {
  const dispatch = useDispatch();
  const allowExperimentalApps = useSelector(allowExperimentalAppsSelector);
  const onSetAllowExperimentalApps = useCallback(
    checked => dispatch(setAllowExperimentalApps(checked)),
    [dispatch],
  );

  return (
    <>
      <Track onUpdate event="AllowExperimentalApps" />
      <Switch
        isChecked={allowExperimentalApps}
        onChange={onSetAllowExperimentalApps}
        data-test-id="settings-allow-experimental-apps"
      />
    </>
  );
};

export default AllowExperimentalAppsToggle;
