import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import ExportOperations from "~/renderer/drawers/ExportOperations";
import DownloadCloud from "~/renderer/icons/DownloadCloud";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";

const ExportOperationsBtn = ({ primary }: { primary: boolean }) => {
  const { t } = useTranslation();
  const accounts = useSelector(activeAccountsSelector);
  const [isOperationsDrawerOpen, setIsOperationsDrawerOpen] = useState(false);

  if (!accounts.length && !primary) return null;

  const openOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(true), [
    setIsOperationsDrawerOpen,
  ]);
  const closeOperationsDrawer = useCallback(() => setIsOperationsDrawerOpen(true), [
    setIsOperationsDrawerOpen,
  ]);

  return (
    <>
      <ExportOperations isOpen={isOperationsDrawerOpen} onClose={closeOperationsDrawer} />
      {primary ? (
        <Button
          small
          primary
          event="ExportAccountOperations"
          disabled={!accounts.length}
          onClick={openOperationsDrawer}
        >
          {t("exportOperationsModal.cta")}
        </Button>
      ) : (
        <LabelWrapper onClick={openOperationsDrawer}>
          <Box mr={1}>
            <DownloadCloud />
          </Box>
          <span>{t("exportOperationsModal.title")}</span>
        </LabelWrapper>
      )}
    </>
  );
};

export default ExportOperationsBtn;

const LabelWrapper = styled(Label)`
  &:hover {
    cursor: pointer;
  }
  font-size: 13px;
  font-family: "Inter", Arial;
  font-weight: 600;
`;
