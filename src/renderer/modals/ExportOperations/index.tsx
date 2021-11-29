import { remote, ipcRenderer } from "electron";
import React, { memo, useState, useCallback } from "react";
import { Trans, useTranslation } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { createStructuredSelector } from "reselect";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { accountsOpToCSV } from "@ledgerhq/live-common/lib/csvExport";
import { Account, Currency } from "@ledgerhq/live-common/lib/types";
import { Alert, Icons, Flex, Text, Log } from "@ledgerhq/react-ui";
import logger from "~/logger";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { closeModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import AccountsList from "~/renderer/components/AccountsList";

const Container = styled(Flex).attrs(() => ({
  flexDirection: "column",
  flex: 1,
  padding: 12,
  height: "100%",
}))``;

const SuccessContainer = styled(Flex).attrs(() => ({
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
}))``;

const BodyContainer = styled(Flex).attrs(() => ({
  flexDirection: "column",
  justifyContent: "flex-start",
  flexShrink: 1,
}))`
  height: 100%;
  overflow-y: scroll;
`;

const FooterContainer = styled(Flex).attrs(() => ({
  flexDirection: "row",
  justifyContent: "flex-end",
}))``;

type Props = {
  onClose: () => void;
  accounts: Account[];
  countervalueCurrency?: Currency;
};

const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
  countervalueCurrency: counterValueCurrencySelector,
});
const mapDispatchToProps = {
  closeModal,
};

const exportOperations = async (
  path: { canceled: boolean; filePath: string },
  csv: string,
  callback?: () => void,
) => {
  try {
    const res = await ipcRenderer.invoke("export-operations", path, csv);
    if (res && callback) {
      callback();
    }
  } catch (error) {}
};

function ExportOperations({ accounts, onClose, countervalueCurrency }: Props) {
  const [checkedIds, setCheckedIds] = useState([]);
  const [success, setSuccess] = useState(false);
  const countervalueState = useCountervaluesState();
  const { t } = useTranslation();

  const exportCsv = useCallback(async () => {
    const path = await remote.dialog.showSaveDialog({
      title: "Exported account transactions",
      defaultPath: `ledgerlive-operations-${moment().format("YYYY.MM.DD")}.csv`,
      filters: [
        {
          name: "All Files",
          extensions: ["csv"],
        },
      ],
    });

    if (path) {
      exportOperations(
        path,
        accountsOpToCSV(
          accounts.filter(account => checkedIds.includes(account.id)),
          countervalueCurrency,
          countervalueState,
        ),
        () => {
          setSuccess(true);
        },
      );
    }
  }, [accounts, checkedIds, countervalueCurrency, countervalueState]);

  const handleContinueButtonClick = useCallback(() => {
    let exporting = false;
    if (exporting) return;
    exporting = true;
    exportCsv()
      .catch(e => {
        logger.critical(e);
      })
      .then(() => {
        exporting = false;
      });
  }, [exportCsv, onClose, success]);

  const handleSelectAll = useCallback((accounts: Account[]) => {
    setCheckedIds(accounts.map(a => a.id));
  }, []);

  const handleUnselectAll = useCallback(() => {
    setCheckedIds([]);
  }, []);

  const toggleAccount = useCallback((account: Account) => {
    setCheckedIds(prevState => {
      if (prevState.includes(account.id)) {
        return [...prevState].filter(id => id !== account.id);
      }
      return [...prevState, account.id];
    });
  }, []);

  const ContinueButton = () => (
    <Button
      disabled={!checkedIds.length}
      data-e2e="continue_button"
      onClick={handleContinueButtonClick}
      event={"Operation history"}
      id="export-operations-save-button"
      variant="main"
    >
      <Trans i18nKey="exportOperationsModal.cta" />
    </Button>
  );

  const DoneButton = () => (
    <Button
      data-e2e="continue_button"
      onClick={onClose}
      id="export-operations-save-button"
      variant="main"
    >
      <Trans i18nKey="exportOperationsModal.ctaSuccess" />
    </Button>
  );

  return (
    <Container
      backgroundColor={success ? "palette.success.c100" : "palette.neutral.c00"}
      justifyContent={success ? "center" : "space-between"}
    >
      {success ? (
        <SuccessContainer>
          <Icons.CircledCheckUltraLight size="72px" color="palette.neutral.c100" />
          <Log mt={12}>
            <Trans i18nKey="exportOperationsModal.titleSuccess" />
          </Log>
          <Text variant="paragraph" color="palette.neutral.c100" mt={7} mb={12}>
            <Trans i18nKey="exportOperationsModal.descSuccess" />
          </Text>
          <DoneButton />
        </SuccessContainer>
      ) : (
        <>
          <Text mb={12} alignSelf="center" variant="h3" color="palette.neutral.c100">
            <Trans i18nKey="exportOperationsModal.title" />
          </Text>
          <BodyContainer>
            <div style={{ marginBottom: "20px" }}>
              <Alert type="warning" title={t("exportOperationsModal.disclaimer")} />
            </div>
            <AccountsList
              emptyText={<Trans i18nKey="exportOperationsModal.noAccounts" />}
              title={
                <>
                  <Trans i18nKey="exportOperationsModal.selectedAccounts" />
                  {checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
                </>
              }
              subtitle={<Trans i18nKey="exportOperationsModal.desc" />}
              accounts={accounts}
              onSelectAll={accounts.length > 1 ? handleSelectAll : undefined}
              onUnselectAll={accounts.length > 1 ? handleUnselectAll : undefined}
              onToggleAccount={toggleAccount}
              checkedIds={checkedIds}
            />
          </BodyContainer>
          <FooterContainer>
            <ContinueButton />
          </FooterContainer>
        </>
      )}
    </Container>
  );
}

const ConnectedExportOperations: React$ComponentType<{}> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportOperations);

export default memo<Props>(ConnectedExportOperations);
