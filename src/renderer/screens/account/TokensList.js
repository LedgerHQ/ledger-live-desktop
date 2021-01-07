// @flow

import React, { PureComponent } from "react";
import type { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";
import { listSubAccounts } from "@ledgerhq/live-common/lib/account/helpers";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import styled from "styled-components";
import { Trans, withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import type { RouterHistory } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { TFunction } from "react-i18next";
import IconPlus from "~/renderer/icons/Plus";
import TokenRow from "~/renderer/components/TokenRow";
import Button from "~/renderer/components/Button";
import { supportLinkByTokenType } from "~/config/urls";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { track } from "~/renderer/analytics/segment";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import perFamilyTokenList from "~/renderer/generated/TokenList";

type OwnProps = {
  account: Account,
  range: PortfolioRange,
};

type Props = {
  ...OwnProps,
  t: TFunction,
  openModal: Function,
  history: RouterHistory,
};

const Wrapper: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-right: ${p => p.theme.space[4]}px;
`;

const EmptyState: ThemedComponent<{}> = styled.div`
  border: 1px dashed ${p => p.theme.colors.palette.text.shade60};
  padding: 15px 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  > :first-child {
    flex: 1;
  }
  > :nth-child(2) {
    align-self: center;
  }
`;

const Placeholder: ThemedComponent<{}> = styled.div`
  flex-direction: column;
  display: flex;
  padding-right: 50px;
`;

const mapDispatchToProps = {
  openModal,
};

// Fixme Temporarily hiding the receive token button
const ReceiveButton = (props: { onClick: () => void }) => (
  <Button small primary onClick={props.onClick}>
    <Box horizontal flow={1} alignItems="center">
      <IconPlus size={12} />
      <Box>
        <Trans i18nKey="tokensList.cta" />
      </Box>
    </Box>
  </Button>
);

class TokensList extends PureComponent<Props> {
  onAccountClick = (account: AccountLike, parentAccount: Account) => {
    this.props.history.push({
      pathname: `/account/${parentAccount.id}/${account.id}`,
      state: { source: "tokens list" },
    });
  };

  onReceiveClick = () => {
    const { account, openModal } = this.props;
    openModal("MODAL_RECEIVE", { account, receiveTokenMode: true });
  };

  render() {
    const { account, t, range, openModal } = this.props;
    if (!account.subAccounts) return null;
    const subAccounts = listSubAccounts(account);
    const { currency } = account;
    const family = currency.family;
    const tokenTypes = listTokenTypesForCryptoCurrency(currency);
    const isTokenAccount = tokenTypes.length > 0;
    const isEmpty = subAccounts.length === 0;

    if (!isTokenAccount && isEmpty) return null;

    const url =
      currency && currency.type !== "TokenCurrency" && tokenTypes && tokenTypes.length > 0
        ? supportLinkByTokenType[tokenTypes[0]]
        : null;

    const specific = perFamilyTokenList[family];
    const hasSpecificTokenWording = specific?.hasSpecificTokenWording;
    const ReceiveButtonComponent = specific?.ReceiveButton ?? ReceiveButton;

    const titleLabel = t(
      hasSpecificTokenWording ? `tokensList.${family}.title` : "tokensList.title",
    );
    const placeholderLabel = t(
      hasSpecificTokenWording ? `tokensList.${family}.placeholder` : "tokensList.placeholder",
      {
        currencyName: currency.name,
      },
    );

    const linkLabel = t(hasSpecificTokenWording ? `tokensList.${family}.link` : "tokensList.link");

    return (
      <Box mb={50}>
        <Wrapper>
          <Text color="palette.text.shade100" mb={2} ff="Inter|Medium" fontSize={6}>
            {isTokenAccount ? titleLabel : t("subAccounts.title")}
          </Text>
          {!isEmpty && isTokenAccount && (
            <ReceiveButtonComponent
              onClick={this.onReceiveClick}
              account={account}
              openModal={openModal}
            />
          )}
        </Wrapper>
        {isEmpty && (
          <EmptyState>
            <Placeholder>
              {url ? (
                <Text color="palette.text.shade80" ff="Inter|SemiBold" fontSize={4}>
                  {placeholderLabel}
                  &nbsp;
                  <LabelWithExternalIcon
                    color="wallet"
                    ff="Inter|SemiBold"
                    onClick={() => {
                      if (url) {
                        openURL(url);
                        track(`More info on Manage ${tokenTypes[0]} tokens`);
                      }
                    }}
                    label={linkLabel}
                  />
                </Text>
              ) : null}
            </Placeholder>
            <ReceiveButtonComponent
              onClick={this.onReceiveClick}
              account={account}
              openModal={openModal}
            />
          </EmptyState>
        )}
        {subAccounts.map((token, index) => (
          <AccountContextMenu key={token.id} account={token} parentAccount={account}>
            <TokenRow
              index={index}
              range={range}
              account={token}
              parentAccount={account}
              onClick={this.onAccountClick}
              disableRounding
            />
          </AccountContextMenu>
        ))}
      </Box>
    );
  }
}

const ConnectedTokenList: React$ComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
  withRouter,
)(TokensList);

export default ConnectedTokenList;
