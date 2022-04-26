import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { listSubAccounts } from "@ledgerhq/live-common/lib/account/helpers";
import { listTokenTypesForCryptoCurrency } from "@ledgerhq/live-common/lib/currencies";
import { Account, TokenAccount, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { PortfolioRange } from "@ledgerhq/live-common/lib/types/portfolio";
import { Icons, Text, Flex } from "@ledgerhq/react-ui";

import Box from "~/renderer/components/Box";
import AccountContextMenu from "~/renderer/components/ContextMenu/AccountContextMenu";
import TokenRow from "~/renderer/components/TokenRow";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { matchesSearch } from "../AccountList/matchesSearch";
import AccountSyncStatusIndicator from "../AccountSyncStatusIndicator";
import Balance from "./Balance";
import Countervalue from "./Countervalue";
import Delta from "./Delta";
import Header from "./Header";
import { hideEmptyTokenAccountsSelector } from "~/renderer/reducers/settings";
import Button from "~/renderer/components/Button";

import perFamilyTokenList from "~/renderer/generated/TokenList";
import Link from "~/renderer/components/Link";

const Row: ThemedComponent<{}> = styled(Flex)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.neutral.c40};
  cursor: pointer;
  flex-direction: column;
  flex: 1;
  padding: 0px 40px;
  justify-content: flex-start;
  position: relative;
  transition: background-color ease-in-out 200ms;
  :hover {
  }
  :active:not(:focus-within) {
  }
`;

const RowContent: ThemedComponent<{
  disabled?: boolean;
  isSubAccountsExpanded: boolean;
}> = styled(Flex)`
  height: 80px;
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  opacity: ${p => (p.disabled ? 0.3 : 1)};
  & * {
    color: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : "auto")};
    fill: ${p => (p.disabled ? p.theme.colors.palette.text.shade100 : "auto")};
  }
`;

const TokenContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const TokenContentWrapper = styled.div`
  position: relative;
`;

const TokenShowMoreButton: ThemedComponent<{ expanded?: boolean }> = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  text-align: center;
`;

const IconAngleDown: ThemedComponent<{ expanded?: boolean }> = styled(Flex)`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${p => (p.expanded ? "rotate(180deg)" : "rotate(0deg)")};
`;

type Props = {
  account: TokenAccount | Account;
  parentAccount?: Account;
  disableRounding?: boolean;
  hideEmptyTokens?: boolean;
  onClick: (AccountLike, Account) => void;
  hidden?: boolean;
  range: PortfolioRange;
  search?: string;
};

type State = {
  expanded: boolean;
};

const expandedStates: { [key: string]: boolean } = {};

class AccountRowItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { account, parentAccount } = this.props;
    const accountId = parentAccount ? parentAccount.id : account.id;

    this.state = {
      expanded: expandedStates[accountId],
    };
  }

  static getDerivedStateFromProps(nextProps: Props) {
    const { account } = nextProps;
    if (account.subAccounts) {
      return {
        expanded: expandedStates[account.id] || !!nextProps.search,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.expanded !== this.state.expanded && !this.state.expanded) {
      const { scrollTopFocusRef } = this;
      if (scrollTopFocusRef.current) {
        scrollTopFocusRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }

  scrollTopFocusRef: React.RefObject<unknown> = React.createRef();

  onClick = () => {
    const { account, parentAccount, onClick } = this.props;
    onClick(account, parentAccount);
  };

  toggleAccordion = (e: SyntheticEvent<any>) => {
    e.stopPropagation();
    const { account } = this.props;
    expandedStates[account.id] = !expandedStates[account.id];
    this.setState({ expanded: expandedStates[account.id] });
  };

  render() {
    const {
      account,
      parentAccount,
      range,
      hidden,
      onClick,
      disableRounding,
      search,
      hideEmptyTokens,
    } = this.props;
    const { expanded } = this.state;

    let currency;
    let unit;
    let mainAccount;
    let tokens;
    let disabled;
    let isToken;

    if (account.type !== "Account") {
      currency = account.token;
      unit = account.token.units[0];
      mainAccount = parentAccount;
      isToken = mainAccount && listTokenTypesForCryptoCurrency(mainAccount.currency).length > 0;

      if (!mainAccount) return null;
    } else {
      currency = account.currency;
      unit = account.unit;
      mainAccount = account;
      tokens = listSubAccounts(account);
      disabled = !matchesSearch(search, account);
      isToken = listTokenTypesForCryptoCurrency(currency).length > 0;
      if (tokens) tokens = tokens.filter(t => matchesSearch(search, t));
    }

    const showTokensIndicator = tokens && tokens.length > 0 && !hidden;

    const specific = perFamilyTokenList[mainAccount.currency.family];
    const hasSpecificTokenWording = specific?.hasSpecificTokenWording;

    const translationMap = isToken
      ? {
          see: hasSpecificTokenWording
            ? `tokensList.${mainAccount.currency.family}.seeTokens`
            : `tokensList.seeTokens`,
          hide: hasSpecificTokenWording
            ? `tokensList.${mainAccount.currency.family}.hideTokens`
            : `tokensList.hideTokens`,
        }
      : {
          see: "subAccounts.seeSubAccounts",
          hide: "subAccounts.hideSubAccounts",
        };

    const key = `${account.id}_${hideEmptyTokens ? "hide_empty_tokens" : ""}`;

    return (
      <div style={{ position: "relative" }} key={key} hidden={hidden}>
        <span style={{ position: "absolute", top: -70 }} ref={this.scrollTopFocusRef} />
        <AccountContextMenu account={account}>
          <Row expanded={expanded} tokens={showTokensIndicator} key={mainAccount.id}>
            <RowContent
              disabled={disabled}
              className="accounts-account-row-item-content"
              isSubAccountsExpanded={showTokensIndicator && expanded}
              onClick={this.onClick}
            >
              <Header account={account} name={mainAccount.name} />
              <Flex flex="10%">
                <AccountSyncStatusIndicator accountId={mainAccount.id} account={account} />
              </Flex>
              <Balance unit={unit} balance={account.balance} disableRounding={disableRounding} />
              <Countervalue account={account} currency={currency} range={range} />
              <Delta account={account} range={range} />
            </RowContent>
            {showTokensIndicator && expanded ? (
              <TokenContentWrapper>
                <TokenContent>
                  {tokens &&
                    tokens.map((token, index) => (
                      <AccountContextMenu
                        key={token.id}
                        account={token}
                        parentAccount={mainAccount}
                      >
                        <TokenRow
                          nested
                          index={index}
                          range={range}
                          account={token}
                          parentAccount={mainAccount}
                          onClick={onClick}
                        />
                      </AccountContextMenu>
                    ))}
                </TokenContent>
              </TokenContentWrapper>
            ) : null}
            {showTokensIndicator && !disabled && tokens && (
              <TokenShowMoreButton
                expanded={expanded}
                event="Account view tokens expand"
                eventProperties={{ currencyName: currency.name }}
                onClick={this.toggleAccordion}
              >
                <Box horizontal alignContent="center" justifyContent="center">
                  <Text color="palette.neutral.c100" variant="small" fontWeight="semiBold">
                    <Trans
                      i18nKey={translationMap[expanded ? "hide" : "see"]}
                      values={{ tokenCount: tokens.length }}
                    />
                  </Text>
                  <IconAngleDown expanded={expanded} ml={2}>
                    <Icons.DropdownMedium color="palette.neutral.c100" size={16} />
                  </IconAngleDown>
                </Box>
              </TokenShowMoreButton>
            )}
          </Row>
        </AccountContextMenu>
      </div>
    );
  }
}
const mapStateToProps = createStructuredSelector({
  hideEmptyTokenAccounts: hideEmptyTokenAccountsSelector,
});

const ConnectedAccountRowItem: React.ReactComponentType<{}> = connect(mapStateToProps)(
  AccountRowItem,
);
export default ConnectedAccountRowItem;
