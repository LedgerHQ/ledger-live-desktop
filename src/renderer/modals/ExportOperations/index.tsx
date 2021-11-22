import { remote, ipcRenderer } from "electron";
import React, { memo, useState, useCallback } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { createStructuredSelector } from "reselect";
import { useCountervaluesState } from "@ledgerhq/live-common/lib/countervalues/react";
import { accountsOpToCSV } from "@ledgerhq/live-common/lib/csvExport";
import { Account, Currency } from "@ledgerhq/live-common/lib/types";
import { Flex, Text } from "@ledgerhq/react-ui";
import logger from "~/logger";
import { counterValueCurrencySelector } from "~/renderer/reducers/settings";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { closeModal } from "~/renderer/actions/modals";
import { colors } from "~/renderer/styles/theme";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import AccountsList from "~/renderer/components/AccountsList";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import IconCheckCircle from "~/renderer/icons/CheckCircle";
import Alert from "~/renderer/components/Alert";

const Container = styled(Flex).attrs(() => ({
  flexDirection: "column",
  justifyContent: "space-between",
  flex: 1,
  padding: 12,
  height: "100%",
  backgroundColor: "palette.neutral.c00",
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
}))``;

type OwnProps = {};
type Props = OwnProps & {
  closeModal: (arg1: string) => void;
  accounts: Account[];
  countervalueCurrency?: Currency;
};

const LabelWrapper = styled(Box)`
  text-align: center;
  font-size: 13px;
  font-family: "Inter";
  font-weight: ;
`;

const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => (props.green ? "#66be5419" : "#6490f119")};
  color: ${props => (props.green ? "#66be54" : "#6490f1")};
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 15px;
`;

const IconWrapper = styled(Box)`
  color: ${_ => colors.positiveGreen};
  align-self: center;
  margin-bottom: 15px;
`;

const Title = styled(Box).attrs(() => ({
  ff: "Inter",
  fontSize: 5,
  mt: 2,
  mb: 15,
  color: "palette.text.shade100",
}))`
  text-align: center;
`;

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

function ExportOperations({ accounts, closeModal, countervalueCurrency }: Props) {
  const [checkedIds, setCheckedIds] = useState([]);
  const [success, setSuccess] = useState(false);
  const countervalueState = useCountervaluesState();

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

  const onClose = useCallback(() => closeModal("MODAL_EXPORT_OPERATIONS"), [closeModal]);

  const handleButtonClick = useCallback(() => {
    let exporting = false;
    if (success) {
      onClose();
    } else {
      if (exporting) return;
      exporting = true;
      exportCsv()
        .catch(e => {
          logger.critical(e);
        })
        .then(() => {
          exporting = false;
        });
    }
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

  const onHide = useCallback(() => {
    setSuccess(false);
    setCheckedIds([]);
  }, []);

  return (
    <Container>
      <Text mb={12} alignSelf="center" variant="h3" color="palette.neutral.c100">
        <Trans i18nKey="exportOperationsModal.title" />
      </Text>
      <BodyContainer>
        {success ? (
          <Box>
            <IconWrapper>
              <IconCheckCircle size={43} />
            </IconWrapper>
            <Title>
              <Trans i18nKey="exportOperationsModal.titleSuccess" />
            </Title>
            <LabelWrapper ff="Inter|Regular">
              <Trans i18nKey="exportOperationsModal.descSuccess" />
            </LabelWrapper>
          </Box>
        ) : (
          <Box>
            <IconWrapperCircle>
              <IconDownloadCloud size={30} />
            </IconWrapperCircle>
            <LabelWrapper mb={2} ff="Inter|Regular">
              <Trans i18nKey="exportOperationsModal.desc" />
            </LabelWrapper>
            <Alert type="warning">
              <Trans i18nKey="exportOperationsModal.disclaimer" />
            </Alert>
            <AccountsList
              emptyText={<Trans i18nKey="exportOperationsModal.noAccounts" />}
              title={
                <>
                  <Trans i18nKey="exportOperationsModal.selectedAccounts" />
                  {checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
                </>
              }
              accounts={accounts}
              onSelectAll={accounts.length > 1 ? handleSelectAll : undefined}
              onUnselectAll={accounts.length > 1 ? handleUnselectAll : undefined}
              onToggleAccount={toggleAccount}
              checkedIds={checkedIds}
            />
          </Box>
        )}
      </BodyContainer>
      <FooterContainer justifyContent="flex-end">
        <Button
          disabled={!success && !checkedIds.length}
          data-e2e="continue_button"
          onClick={handleButtonClick}
          event={!success ? "Operation history" : undefined}
          id="export-operations-save-button"
          variant="main"
        >
          {success ? (
            <Trans i18nKey="exportOperationsModal.ctaSuccess" />
          ) : (
            <Trans i18nKey="exportOperationsModal.cta" />
          )}
        </Button>
      </FooterContainer>
    </Container>
  );
}

const ConnectedExportOperations: React.ReactComponentType<OwnProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportOperations);

export default memo<Props>(ConnectedExportOperations);
