// @flow
import { remote, ipcRenderer } from "electron";
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import moment from "moment";
import { createStructuredSelector } from "reselect";
import { accountsOpToCSV } from "@ledgerhq/live-common/lib/csvExport";
import type { Account } from "@ledgerhq/live-common/lib/types";
import logger from "~/logger";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { closeModal } from "~/renderer/actions/modals";
import { colors } from "~/renderer/styles/theme";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import AccountsList from "~/renderer/components/AccountsList";
import IconDownloadCloud from "~/renderer/icons/DownloadCloud";
import IconCheckCircle from "~/renderer/icons/CheckCircle";

type OwnProps = {};
type Props = OwnProps & {
  closeModal: string => void,
  accounts: Account[],
};

type State = {
  checkedIds: string[],
  success: boolean,
};
const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
});
const mapDispatchToProps = {
  closeModal,
};

const exportOperations = async (
  path: { canceled: boolean, filePath: string },
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

class ExportOperations extends PureComponent<Props, State> {
  state = {
    checkedIds: [],
    success: false,
  };

  export = async () => {
    const { accounts } = this.props;
    const { checkedIds } = this.state;
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
        accountsOpToCSV(accounts.filter(account => checkedIds.includes(account.id))),
        () => {
          this.setState({ success: true });
        },
      );
    }
  };

  exporting = false;

  handleButtonClick = () => {
    const { success } = this.state;
    if (success) {
      this.onClose();
    } else {
      if (this.exporting) return;
      this.exporting = true;
      this.export()
        .catch(e => {
          logger.critical(e);
        })
        .then(() => {
          this.exporting = false;
        });
    }
  };

  onClose = () => this.props.closeModal("MODAL_EXPORT_OPERATIONS");

  toggleAccount = (account: Account) => {
    this.setState(prevState => {
      if (prevState.checkedIds.includes(account.id)) {
        return { checkedIds: [...prevState.checkedIds].filter(id => id !== account.id) };
      }
      return { checkedIds: [...prevState.checkedIds, account.id] };
    });
  };

  render() {
    const { accounts } = this.props;
    const { checkedIds, success } = this.state;
    return (
      <Modal
        name="MODAL_EXPORT_OPERATIONS"
        centered
        onHide={() => this.setState({ success: false, checkedIds: [] })}
      >
        <ModalBody
          onClose={this.onClose}
          title={<Trans i18nKey="exportOperationsModal.title" />}
          render={() =>
            success ? (
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
                <LabelWrapper ff="Inter|Regular">
                  <Trans i18nKey="exportOperationsModal.desc" />
                </LabelWrapper>
                <AccountsList
                  emptyText={<Trans i18nKey="exportOperationsModal.noAccounts" />}
                  title={
                    <>
                      <Trans i18nKey="exportOperationsModal.selectedAccounts" />
                      {checkedIds.length > 0 ? ` (${checkedIds.length})` : ""}
                    </>
                  }
                  accounts={accounts}
                  onToggleAccount={this.toggleAccount}
                  checkedIds={checkedIds}
                />
              </Box>
            )
          }
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button
                disabled={!success && !checkedIds.length}
                data-e2e="continue_button"
                onClick={this.handleButtonClick}
                event={!success ? "Operation history" : undefined}
                primary
              >
                {success ? (
                  <Trans i18nKey="exportOperationsModal.ctaSuccess" />
                ) : (
                  <Trans i18nKey="exportOperationsModal.cta" />
                )}
              </Button>
            </Box>
          )}
        />
      </Modal>
    );
  }
}

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

const ConnectedExportOperations: React$ComponentType<OwnProps> = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExportOperations);

export default ConnectedExportOperations;
