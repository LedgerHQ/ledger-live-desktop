// @flow
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import Switch from "~/renderer/components/Switch";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Track from "~/renderer/analytics/Track";
import { hasPasswordSelector } from "~/renderer/reducers/application";

const PasswordButton = () => {
  const dispatch = useDispatch();
  const hasPassword = useSelector(hasPasswordSelector);
  const { t } = useTranslation();

  const handleOpenPasswordModal = useCallback(() => {
    dispatch(openModal("MODAL_PASSWORD"));
  }, [dispatch]);

  const handleOpenDisablePassword = useCallback(() => {
    dispatch(openModal("MODAL_DISABLE_PASSWORD"));
  }, [dispatch]);

  const handleChangePasswordCheck = useCallback(
    (isChecked: boolean) => {
      if (isChecked) {
        handleOpenPasswordModal();
      } else {
        handleOpenDisablePassword();
      }
    },
    [handleOpenPasswordModal, handleOpenDisablePassword],
  );

  return (
    <>
      <Track onUpdate event={hasPassword ? "PasswordEnabled" : "PasswordDisabled"} />
      <Box horizontal flow={2} alignItems="center">
        {hasPassword && (
          <Button
            small
            onClick={handleOpenPasswordModal}
            data-test-id="settings-password-change-button"
          >
            {t("settings.profile.changePassword")}
          </Button>
        )}
        <Switch
          isChecked={hasPassword}
          onChange={handleChangePasswordCheck}
          data-test-id="settings-password-lock-switch"
        />
      </Box>
    </>
  );
};

export default PasswordButton;
