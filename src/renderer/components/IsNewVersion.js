// @flow
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { lastUsedVersionSelector } from "~/renderer/reducers/settings";

import { saveSettings } from "~/renderer/actions/settings";
import { openModal } from "~/renderer/actions/modals";

const IsNewVersion = () => {
  const dispatch = useDispatch();
  const lastUsedVersion = useSelector(lastUsedVersionSelector);
  const currentVersion = __APP_VERSION__;

  useEffect(() => {
    // always display the release notes (beta)
    dispatch(openModal("MODAL_RELEASE_NOTES", currentVersion));
    dispatch(saveSettings({ lastUsedVersion: currentVersion }));
  }, [currentVersion, dispatch, lastUsedVersion]);

  return null;
};

export default IsNewVersion;
