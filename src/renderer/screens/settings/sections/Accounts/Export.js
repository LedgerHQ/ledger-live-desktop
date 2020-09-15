// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_WS_EXPORT } from "~/config/constants";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import ExportOperationsBtn from "~/renderer/components/ExportOperationsBtn";
import DownloadCloud from "~/renderer/icons/DownloadCloud";
import IconShare from "~/renderer/icons/Share";
import { SettingsSectionHeader as Header } from "../../SettingsSection";
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
      <Header
        icon={<IconShare size={16} />}
        title={t("settings.export.accounts.title")}
        desc={t("settings.export.accounts.desc")}
        renderRight={
          <Button small event="Export accounts" onClick={onModalOpen} primary>
            {t("settings.export.accounts.button")}
          </Button>
        }
      />
      <Header
        icon={<DownloadCloud size={16} />}
        title={t("settings.export.operations.title")}
        desc={t("settings.export.operations.desc")}
        renderRight={<ExportOperationsBtn primary />}
      />

      {EXPERIMENTAL_WS_EXPORT && (
        <Header
          icon={<IconShare size={16} />}
          title="Experimental websocket local export ⚡"
          desc="Generate a pairing code and use it on Ledger Live Mobile"
          renderRight={<SocketExport />}
        />
      )}
    </>
  );
};

export default SectionExport;
