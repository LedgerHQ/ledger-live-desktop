// @flow
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHideEmptyTokenAccounts } from "~/renderer/actions/settings";
import { hideEmptyTokenAccountsSelector } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";
import Switch from "~/renderer/components/Switch";

const HideEmptyTokenAccountsToggle = () => {
  const hideEmptyTokenAccounts = useSelector(hideEmptyTokenAccountsSelector);
  const dispatch = useDispatch();

  const handleOnChange = useCallback(
    (value: boolean) => {
      dispatch(setHideEmptyTokenAccounts(value));
    },
    [dispatch],
  );

  return (
    <>
      <Track
        onUpdate
        event={
          hideEmptyTokenAccounts
            ? "hideEmptyTokenAccountsEnabled"
            : "hideEmptyTokenAccountsDisabled"
        }
      />
      <Switch
        isChecked={hideEmptyTokenAccounts}
        onChange={handleOnChange}
        id="settings-accounts-hide-empty-button"
      />
    </>
  );
};

export default HideEmptyTokenAccountsToggle;
