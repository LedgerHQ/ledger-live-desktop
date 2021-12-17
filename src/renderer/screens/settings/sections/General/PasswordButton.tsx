import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import Switch from "~/renderer/components/Switch";
import { Flex } from "@ledgerhq/react-ui";
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
      <Flex alignItems="center" columnGap={11}>
        {hasPassword && (
          <Button onClick={handleOpenPasswordModal} variant="main">
            {t("settings.profile.changePassword")}
          </Button>
        )}
        <Switch
          name="password-lock-switch"
          isChecked={hasPassword}
          onChange={handleChangePasswordCheck}
        />
      </Flex>
    </>
  );
};

export default PasswordButton;
