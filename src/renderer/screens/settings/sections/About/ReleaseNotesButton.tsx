import React, { SyntheticEvent, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

const ReleaseNotesButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const version = __APP_VERSION__;
  const onClick = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_RELEASE_NOTES", version));
    },
    [dispatch, version],
  );

  return (
    <Button event="Version details" variant="main" onClick={onClick}>
      {t("settings.help.releaseNotesBtn")}
    </Button>
  );
};

export default ReleaseNotesButton;
