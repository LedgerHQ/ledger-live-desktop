import React, { SyntheticEvent, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_WS_EXPORT } from "~/config/constants";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import { SectionRow as Row } from "../../Rows";
import SocketExport from "./SocketExport";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";

const SectionExport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const accounts = useSelector(activeAccountsSelector);

  const onExportAccounts = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_EXPORT_ACCOUNTS"));
    },
    [dispatch],
  );

  const onExportOperations = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_EXPORT_OPERATIONS"));
    },
    [dispatch],
  );

  return (
    <>
      <Row title={t("settings.export.accounts.title")} desc={t("settings.export.accounts.desc")}>
        <Button
          event="Export accounts"
          onClick={onExportAccounts}
          variant="main"
          style={{ width: "120px" }}
        >
          {t("settings.export.accounts.button")}
        </Button>
      </Row>
      <Row
        title={t("settings.export.operations.title")}
        desc={t("settings.export.operations.desc")}
      >
        {accounts.length > 0 && (
          <Button
            event="ExportAccountOperations"
            disabled={!accounts.length}
            onClick={onExportOperations}
            variant="main"
            style={{ width: "120px" }}
          >
            {t("exportOperationsModal.cta")}
          </Button>
        )}
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
