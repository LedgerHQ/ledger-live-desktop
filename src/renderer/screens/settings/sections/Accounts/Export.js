// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_WS_EXPORT } from "~/config/constants";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import ExportOperationsBtn from "~/renderer/components/ExportOperationsBtn";
import { SettingsSectionRow as Row } from "../../SettingsSection";
import SocketExport from "./SocketExport";

const SectionExport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onModalOpen = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_EXPORT_ACCOUNTS"));
    },
    [dispatch],
  );

  return (
    <>
      <Row title={t("settings.export.accounts.title")} desc={t("settings.export.accounts.desc")}>
        <Button small event="Export accounts" onClick={onModalOpen} primary>
          {t("settings.export.accounts.button")}
        </Button>
      </Row>
      <Row
        title={t("settings.export.operations.title")}
        desc={t("settings.export.operations.desc")}
      >
        <ExportOperationsBtn primary />
      </Row>
      {EXPERIMENTAL_WS_EXPORT && (
        <Row
          title="Experimental websocket local export ⚡"
          desc="Generate a pairing code and use it on Ledger Live Mobile"
        >
          <SocketExport />
        </Row>
      )}
    </>
  );
};

export default SectionExport;
