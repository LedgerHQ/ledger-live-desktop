import React, { SyntheticEvent, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_WS_EXPORT } from "~/config/constants";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import { SectionRow as Row } from "../../Rows";
import SocketExport from "./SocketExport";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import ExportOperations from "~/renderer/drawers/ExportOperations";

const SectionExport = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const accounts = useSelector(activeAccountsSelector);
  const [isOperationsDrawerOpen, setIsOperationsDrawerOpen] = useState(false);

  const onExportAccounts = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault();
      dispatch(openModal("MODAL_EXPORT_ACCOUNTS"));
    },
    [dispatch],
  );

  const openOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(true), [
    setIsOperationsDrawerOpen,
  ]);
  const closeOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(false), [
    setIsOperationsDrawerOpen,
  ]);

  return (
    <>
      <ExportOperations isOpen={isOperationsDrawerOpen} onClose={closeOperationsDrawer} />
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
            onClick={openOperationsDrawer}
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
