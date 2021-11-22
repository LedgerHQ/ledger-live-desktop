import React, { Component } from "react";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withTranslation, TFunction } from "react-i18next";
import { connect } from "react-redux";
import styled from "styled-components";
import { Account } from "@ledgerhq/live-common/lib/types/account";
import Box from "~/renderer/components/Box";
import ExportOperations from "~/renderer/modals/ExportOperations";
import DownloadCloud from "~/renderer/icons/DownloadCloud";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import { activeAccountsSelector } from "~/renderer/reducers/accounts";
import { context as drawersContext } from "~/renderer/drawers/Provider";

const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
});

class ExportOperationsBtn extends Component<{
  t: TFunction;
  primary?: boolean;
  accounts: Account[];
}> {
  static contextType = drawersContext;
  openModal = () => this.context.setDrawer(ExportOperations);
  render() {
    const { t, primary, accounts } = this.props;
    if (!accounts.length && !primary) return null;

    return primary ? (
      <Button
        small
        primary
        event="ExportAccountOperations"
        disabled={!accounts.length}
        onClick={this.openModal}
      >
        {t("exportOperationsModal.cta")}
      </Button>
    ) : (
      <LabelWrapper onClick={this.openModal}>
        <Box mr={1}>
          <DownloadCloud />
        </Box>
        <span>{t("exportOperationsModal.title")}</span>
      </LabelWrapper>
    );
  }
}

export default compose(connect(mapStateToProps), withTranslation())(ExportOperationsBtn);

const LabelWrapper = styled(Label)`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
  color: ${p => p.theme.colors.wallet};
  font-size: 13px;
  font-family: "Inter", Arial;
  font-weight: 600;
`;
