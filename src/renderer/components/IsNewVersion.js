// @flow
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import gt from "semver/functions/gt";

import { lastUsedVersionSelector } from "~/renderer/reducers/settings";

import { saveSettings } from "~/renderer/actions/settings";
import { openModal } from "~/renderer/actions/modals";

const IsNewVersion = () => {
  const dispatch = useDispatch();
  const lastUsedVersion = useSelector(lastUsedVersionSelector);
  const currentVersion = __APP_VERSION__;

  useEffect(() => {
    if (gt(currentVersion, lastUsedVersion)) {
      dispatch(openModal("MODAL_RELEASE_NOTES", currentVersion));
      dispatch(saveSettings({ lastUsedVersion: currentVersion }));
    }
  }, [currentVersion, dispatch, lastUsedVersion]);

  return null;
};

export default IsNewVersion;
