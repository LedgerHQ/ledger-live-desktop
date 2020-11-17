// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withTranslation, Trans } from "react-i18next";

import { openModal } from "~/renderer/actions/modals";
import type { TFunction } from "react-i18next";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";

import IconReceive from "~/renderer/icons/Receive";
import IconExchange from "~/renderer/icons/Exchange";
import Box from "~/renderer/components/Box";
import Image from "~/renderer/components/Image";
import lightEmptyStateAccount from "~/renderer/images/light-empty-state-account.svg";
import darkEmptyStateAccount from "~/renderer/images/dark-empty-state-account.svg";

import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike,
  parentAccount: ?Account,
};

type Props = OwnProps & {
  t: TFunction,
  history: *,
  openModal: Function,
};

class EmptyStateAccount extends PureComponent<Props, *> {
  render() {
    const { t, account, parentAccount, openModal, history } = this.props;
    const mainAccount = getMainAccount(account, parentAccount);
    if (!mainAccount) return null;
    const availableOnExchange = isCurrencySupported("BUY", getAccountCurrency(account));

    const hasTokens =
      mainAccount.subAccounts &&
      mainAccount.subAccounts.length &&
      mainAccount.subAccounts[0].type === "TokenAccount";

    return (
      <Box mt={7} alignItems="center" selectable>
        <Image
          alt="emptyState Account logo"
          resource={{
            light: lightEmptyStateAccount,
            dark: darkEmptyStateAccount,
          }}
          width="400"
          themeTyped
        />
        <Box mt={5} alignItems="center">
          <Title>{t("account.emptyState.title")}</Title>
          <Description mt={3} style={{ display: "block" }}>
            {hasTokens ? (
              <Trans i18nKey="account.emptyState.descToken">
                {"Make sure the"}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.managerAppName}
                </Text>
                {"app is installed and start receiving"}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.ticker}
                </Text>
                {"and"}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {account &&
                    account.currency &&
                    // $FlowFixMe
                    listTokenTypesForCryptoCurrency(account.currency).join(", ")}
                  {"tokens"}
                </Text>
              </Trans>
            ) : (
              <Trans i18nKey="account.emptyState.desc">
                {"Make sure the"}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.managerAppName}
                </Text>
                {"app is installed and start receiving"}
              </Trans>
            )}
          </Description>
          <Box horizontal>
            {availableOnExchange ? (
              <Button
                mt={5}
                mr={2}
                primary
                onClick={() =>
                  history.push({ pathname: "/exchange", state: { source: "empty state account" } })
                }
              >
                <Box horizontal flow={1} alignItems="center">
                  <IconExchange size={12} />
                  <Box>{t("account.emptyState.buttons.buy")}</Box>
                </Box>
              </Button>
            ) : null}
            <Button
              mt={5}
              primary
              onClick={() => openModal("MODAL_RECEIVE", { account, parentAccount })}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconReceive size={12} />
                <Box>{t("account.emptyState.buttons.receiveFunds")}</Box>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
}

const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 6,
  color: "palette.text.shade100",
}))``;

const Description: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 4,
  color: "palette.text.shade80",
  textAlign: "center",
}))``;

const ConnectedEmptyStateAccount: React$ComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withRouter,
  withTranslation(),
)(EmptyStateAccount);

export default ConnectedEmptyStateAccount;
