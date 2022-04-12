// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { enableLearnPageStagingUrlSelector } from "~/renderer/reducers/settings";
import { setEnableLearnPageStagingUrl } from "~/renderer/actions/settings";
import Switch from "~/renderer/components/Switch";

const EnableLearnPageStagingUrl = () => {
  const dispatch = useDispatch();
  const enableLearnPageStagingUrl = useSelector(enableLearnPageStagingUrlSelector);
  const onSetEnablePlatformDevTools = useCallback(
    checked => dispatch(setEnableLearnPageStagingUrl(checked)),
    [dispatch],
  );

  return (
    <>
      <Switch
        isChecked={!!enableLearnPageStagingUrl}
        onChange={onSetEnablePlatformDevTools}
        data-test-id="settings-enable-earn-page-staging-url"
      />
    </>
  );
};

export default EnableLearnPageStagingUrl;
