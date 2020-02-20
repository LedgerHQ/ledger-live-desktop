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
import Box from "~/renderer/components/Box";
import Image from "~/renderer/components/Image";
import lightEmptyStateAccount from "~/renderer/images/light-empty-state-account.svg";
import darkEmptyStateAccount from "~/renderer/images/dark-empty-state-account.svg";

import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import { Title, Description } from "~/renderer/screens/accounts/EmptyState";

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike,
  parentAccount: ?Account,
};

type Props = {
  ...OwnProps,
  t: TFunction,
  openModal: Function,
};

class EmptyStateAccount extends PureComponent<Props, *> {
  render() {
    const { t, account, parentAccount, openModal } = this.props;
    const mainAccount = getMainAccount(account, parentAccount);
    if (!mainAccount) return null;

    const hasTokens =
      mainAccount.subAccounts &&
      mainAccount.subAccounts.length &&
      mainAccount.subAccounts[0].type === "TokenAccount";

    return (
      <Box mt={7} alignItems="center" selectable>
        <Image
          alt="emptyState Dashboard logo"
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
    );
  }
}

const ConnectedEmptyStateAccount: React$ComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(EmptyStateAccount);

export default ConnectedEmptyStateAccount;
