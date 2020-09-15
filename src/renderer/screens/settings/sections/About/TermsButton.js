// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

const TermsButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onClick = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_TERMS", { showClose: true }));
    },
    [dispatch],
  );

  return (
    <Button event="Terms of use read" small primary onClick={onClick}>
      {t("settings.help.termsBtn")}
    </Button>
  );
};

export default TermsButton;
